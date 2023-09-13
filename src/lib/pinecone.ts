import {
	Document,
	RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter'
import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import md5 from 'md5'
import OpenAI from 'openai'

import { getEmbeddings } from '@/lib/embeddings'
import { chunkedUpsert } from '@/lib/utils/chunked-upsert'
import { downloadPdf } from '@/lib/utils/download-pdf'
import { removeNonAscii } from '@/lib/utils/remove-non-ascii'

export const pinecone = new Pinecone()

type PDFPage = {
	pageContent: string
	metadata: {
		loc: {
			pageNumber: number
		}
	}
}

export const loadPdfIntoPinecone = async (
	fileKey: string,
	fileName: string,
	fileUrl: string
) => {
	try {
		const filePath = await downloadPdf(fileUrl, fileName)

		if (!filePath) {
			throw new Error('Unable to retrieve file path')
		}

		const pdfLoader = new PDFLoader(filePath)
		const pdfPages = (await pdfLoader.load()) as PDFPage[]

		const documents = await Promise.all(pdfPages.map(prepareDocument))
		const vectors = await Promise.all(documents.flat().map(embedDocument))

		const index = pinecone.index('chatpdf')
		const namespace = index.namespace(removeNonAscii(fileKey))

		chunkedUpsert(namespace, vectors)
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			throw error
		}

		throw new Error(`Error loading PDF into Pinecone: ${error}`)
	}
}

export const truncateStringByBytes = (str: string, bytes: number) => {
	const encoder = new TextEncoder()

	return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes))
}

const prepareDocument = async (page: PDFPage) => {
	let { pageContent, metadata } = page

	pageContent = pageContent.replace(/\n/g, '')

	const splitter = new RecursiveCharacterTextSplitter()
	const documents = await splitter.splitDocuments([
		new Document({
			pageContent,
			metadata: {
				pageNumber: metadata.loc.pageNumber,
				text: truncateStringByBytes(pageContent, 36000),
			},
		}),
	])

	return documents
}

const embedDocument = async (document: Document): Promise<PineconeRecord> => {
	try {
		const embeddings = await getEmbeddings(document.pageContent)
		const hash = md5(document.pageContent)

		const vector = {
			id: hash,
			values: embeddings,
			metadata: {
				text: document.metadata.text as string,
				pageNumber: document.metadata.pageNumber as number,
			},
		}

		return vector
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			throw error
		}

		throw new Error(`Error embedding document: ${error}`)
	}
}
