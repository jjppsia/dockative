/* eslint-disable no-console */
import OpenAI from 'openai'

const openai = new OpenAI()

let requestCount = 0

export const getEmbeddings = async (text: string) => {
	requestCount += 1

	console.log(`Request count: ${requestCount}`)

	try {
		const embedding = await openai.embeddings.create({
			input: text.replace(/\n/g, ''),
			model: 'text-embedding-ada-002',
		})

		return embedding.data[0].embedding
	} catch (error) {
		console.error(`Error from getting embeddings: ${error}`)
		throw error
	}
}
