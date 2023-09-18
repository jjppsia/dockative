import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { z } from 'zod'

import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { loadS3IntoPinecone } from '@/lib/pinecone'
import { getS3Url } from '@/lib/s3/client'

const createChatSchema = z.object({
	fileKey: z.string(),
	fileName: z.string(),
})

export type CreateChatSchema = z.infer<typeof createChatSchema>

export async function POST(req: Request) {
	try {
		const { userId } = auth()
		const isAuthenticated = !!userId

		if (!isAuthenticated) {
			return NextResponse.json({
				success: false,
				status: 401,
				error: 'Unauthorized.',
			})
		}

		const json = await req.json()
		const { fileKey, fileName } = createChatSchema.parse(json)

		const documents = await loadS3IntoPinecone(fileKey)

		const chatId = await db
			.insert(chats)
			.values({
				userId,
				fileKey,
				pdfName: fileName,
				pdfUrl: getS3Url(fileKey),
			})
			.returning({
				insertedId: chats.id,
			})

		return NextResponse.json(
			{
				success: true,
				chatId: chatId[0].insertedId,
				documents,
			},
			{
				status: 201,
				statusText: 'Created.',
			}
		)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: error.issues,
				},
				{
					status: 422,
					statusText: 'Unprocessable Entity.',
				}
			)
		}

		return NextResponse.json(
			{
				success: false,
				error,
			},
			{
				status: 500,
				statusText: 'Internal Server Error.',
			}
		)
	}
}
