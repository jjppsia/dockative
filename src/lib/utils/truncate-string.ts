export const truncateStringByBytes = (str: string, bytes: number) => {
	const encoder = new TextEncoder()

	return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes))
}
