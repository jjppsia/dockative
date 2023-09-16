import OpenAI from 'openai'

const openai = new OpenAI()

export const getEmbeddings = async (text: string) => {
	try {
		const embedding = await openai.embeddings.create({
			input: text.replace(/\n/g, ' '),
			model: 'text-embedding-ada-002',
		})

		return embedding.data[0].embedding
	} catch (error) {
		/* eslint-disable no-console */
		console.error(`Error from getting embeddings: ${error}`)
		throw error
	}
}
