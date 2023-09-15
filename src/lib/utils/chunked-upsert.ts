import { Index, PineconeRecord } from '@pinecone-database/pinecone'

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
	return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
		arr.slice(i * chunkSize, (i + 1) * chunkSize)
	)
}

export const chunkedUpsert = async (
	namespace: Index,
	vectors: PineconeRecord[],
	chunkSize = 10
) => {
	const chunks = sliceIntoChunks<PineconeRecord>(vectors, chunkSize)

	try {
		await Promise.allSettled(
			chunks.map(async (chunk) => {
				try {
					await namespace.upsert([...chunk])
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error(`Error upserting chunk: ${error}`)
				}
			})
		)

		return true
	} catch (error) {
		throw new Error(`Error upserting vectors into index: ${error}`)
	}
}
