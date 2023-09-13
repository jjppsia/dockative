import { env } from '@/env.mjs'
import { Configuration, OpenAIApi } from 'openai-edge'

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const getEmbeddings = async (text: string) => {
	try {
		const response = await openai.createEmbedding({
			input: text.replace(/\n/g, ''),
			model: 'text-embedding-ada-002',
		})

		const result = await response.json()

		return result.data[0].embedding as number[]
	} catch (error) {
		throw new Error(`Error getting embeddings from OpenAI: ${error}`)
	}
}
