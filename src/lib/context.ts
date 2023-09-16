import { env } from '@/env.mjs'
import { ScoredVector } from '@pinecone-database/pinecone'

import { getEmbeddings } from '@/lib/embeddings'
import { getPineconeClient, removeNonAscii } from '@/lib/utils'

type Metadata = {
	pageNumber: number
	text: string
}

const getMatchesFromEmbeddings = async (
	embeddings: number[],
	topK: number,
	fileKey: string
): Promise<ScoredVector[]> => {
	const pinecone = await getPineconeClient()
	const index = pinecone.Index(env.PINECONE_INDEX_NAME)
	const namespace = removeNonAscii(fileKey)

	try {
		const queryResult = await index.query({
			queryRequest: {
				topK,
				vector: embeddings,
				includeMetadata: true,
				namespace,
			},
		})

		return queryResult.matches || []
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(`Error from getting matches: ${error}`)
		throw error
	}
}

export const getContext = async (
	message: string,
	fileKey: string,
	maxTokens = 3000,
	minScore = 0.7
): Promise<string | ScoredVector[]> => {
	const embedding = await getEmbeddings(message)
	const matches = await getMatchesFromEmbeddings(embedding, 5, fileKey)

	const qualifyingDocs = matches.filter(
		(match) => match.score && match.score > minScore
	)

	let docs = matches
		? qualifyingDocs.map((match) => (match.metadata as Metadata).text)
		: []

	return docs.join('\n').substring(0, maxTokens)
}
