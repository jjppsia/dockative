import { env } from '@/env.mjs'
import { PineconeClient } from '@pinecone-database/pinecone'

let pinecone: PineconeClient | null = null

export const getPineconeClient = async () => {
	if (!pinecone) {
		pinecone = new PineconeClient()

		await pinecone.init({
			environment: env.PINECONE_ENVIRONMENT!,
			apiKey: env.PINECONE_API_KEY!,
		})
	}

	return pinecone
}
