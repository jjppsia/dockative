import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { z } from 'zod'

import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { loadPdfIntoPinecone } from '@/lib/pinecone'

const createChatSchema = z.object({
	fileKey: z.string(),
	fileName: z.string(),
	fileUrl: z.string(),
})

export async function POST(req: Request) {
	try {
		const { userId } = auth()

		if (!userId) {
			return NextResponse.json({
				status: 401,
				error: 'Unauthorized',
			})
		}

		const json = await req.json()
		const { fileKey, fileName, fileUrl } = createChatSchema.parse(json)

		await loadPdfIntoPinecone(fileKey, fileName, fileUrl)

		const chatId = await db
			.insert(chats)
			.values({
				userId,
				fileKey,
				pdfName: fileName,
				pdfUrl: fileUrl,
			})
			.returning({
				insertedId: chats.id,
			})

		return NextResponse.json({
			status: 200,
			data: {
				chatId: chatId[0].insertedId,
			},
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({
				status: 422,
				error: error.issues,
			})
		}

		return NextResponse.json({
			status: 500,
			error: 'Internal Server Error',
		})
	}
}
