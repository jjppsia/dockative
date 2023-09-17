import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'

export const runtime = 'edge'

const createChatSchema = z.object({ chatId: z.number() })

export const POST = async (req: Request) => {
	const json = await req.json()
	const { chatId } = createChatSchema.parse(json)

	const _messages = await db
		.select()
		.from(messages)
		.where(eq(messages.chatId, chatId))

	return NextResponse.json(_messages)
}
