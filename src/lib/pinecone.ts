import { env } from '@/env.mjs'
import {
	Document,
	RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter'
import { utils, Vector } from '@pinecone-database/pinecone'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import md5 from 'md5'

import { getEmbeddings } from '@/lib/embeddings'
import { downloadFromS3 } from '@/lib/s3/server'
import {
	getPineconeClient,
	removeNonAscii,
	truncateStringByBytes,
} from '@/lib/utils'

type PDFPage = {
	pageContent: string
	metadata: {
		loc: { pageNumber: number }
	}
}

export const loadS3IntoPinecone = async (fileKey: string) => {
	const fileName = await downloadFromS3(fileKey)

	const pdfLoader = new PDFLoader(fileName)
	const pdfPages = (await pdfLoader.load()) as PDFPage[]

	const splitter = new RecursiveCharacterTextSplitter()

	const documents = await Promise.all(
		pdfPages.map((page) => prepareDocument(page, splitter))
	)
	const vectors = await Promise.all(documents.flat().map(embedDocument))

	const pinecone = await getPineconeClient()
	const index = pinecone.Index(env.PINECONE_INDEX_NAME)

	const namespace = removeNonAscii(fileKey)

	await utils.chunkedUpsert(index, vectors, namespace, 10)

	return documents[0]
}

const embedDocument = async (document: Document): Promise<Vector> => {
	try {
		const embedding = await getEmbeddings(document.pageContent)
		const hash = md5(document.pageContent)

		return {
			id: hash,
			values: embedding,
			metadata: {
				pageNumber: document.metadata.pageNumber as number,
				text: document.metadata.text as string,
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

	return documents
}
