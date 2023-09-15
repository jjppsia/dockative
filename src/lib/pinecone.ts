import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone'
import { Document } from 'langchain/document'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import md5 from 'md5'

import { getEmbeddings } from '@/lib/embeddings'
import { downloadFromS3 } from '@/lib/s3/server'
import { chunkedUpsert } from '@/lib/utils/chunked-upsert'
import { removeNonAscii } from '@/lib/utils/remove-non-ascii'
import { truncateStringByBytes } from '@/lib/utils/truncate-string'

const pinecone = new Pinecone()

type PDFPage = {
	pageContent: string
	metadata: {
		loc: { pageNumber: number }
	}
}

export const loadPdfIntoPinecone = async (fileKey: string) => {
	const fileName = await downloadFromS3(fileKey)

	const pdfLoader = new PDFLoader(fileName)
	const pdfPages = (await pdfLoader.load()) as PDFPage[]

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	})

	const documents = await Promise.all(
		pdfPages.map((page) => prepareDocument(page, splitter))
	)
	const vectors = await Promise.all(documents.flat().map(embedDocument))

	const index = pinecone.index('chatpdf')
	const namespace = index.namespace(removeNonAscii(fileKey))

	chunkedUpsert(namespace, vectors)

	return documents[0]
}

const embedDocument = async (document: Document): Promise<PineconeRecord> => {
	try {
		const embedding = await getEmbeddings(document.pageContent)
		const hash = md5(document.pageContent)

		return {
			id: hash,
			values: embedding,
			metadata: {
				pageNumber: document.metadata.pageNumber as number,
				text: document.metadata.text as string,
				hash: document.metadata.hash as string,
			},
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(`Error from embedding document: ${error}`)
		throw error
	}
}

const prepareDocument = async (
	pdfPage: PDFPage,
	splitter: RecursiveCharacterTextSplitter
): Promise<Document[]> => {
	let { pageContent, metadata } = pdfPage

	pageContent = pageContent.replace(/\n/g, '')

	const documents = await splitter.splitDocuments([
		new Document({
			pageContent,
			metadata: {
				pageNumber: metadata.loc.pageNumber,
				text: truncateStringByBytes(pageContent, 36000),
			},
		}),
	])

	return documents.map((document: Document) => {
		return {
			pageContent: document.pageContent,
			metadata: {
				...document.metadata,
				hash: md5(document.pageContent),
			},
		}
	})
}
