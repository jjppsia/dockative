import { NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { eq } from 'drizzle-orm'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat'

import { getContext } from '@/lib/context'
import { db } from '@/lib/db'
import { messages as _messages, chats } from '@/lib/db/schema'

export const runtime = 'edge'

const openai = new OpenAI()

type ChatRequestJson = {
	messages: ChatCompletionMessageParam[]
	chatId: number
}

export async function POST(req: Request) {
	const { messages, chatId } = (await req.json()) as ChatRequestJson

	const _chats = await db.select().from(chats).where(eq(chats.id, chatId))

	if (_chats.length === 0) {
		return NextResponse.json(
			{
				success: false,
				error: 'Chat not found.',
			},
			{
				status: 404,
				statusText: 'Not Found.',
			}
		)
	}

	const fileKey = _chats[0].fileKey

	const lastMessage = messages[messages.length - 1]

	const context = await getContext(lastMessage.content!, fileKey)

	const prompt: ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
		The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
		AI is a well-behaved and well-mannered individual.
		AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
		AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
		AI assistant is a big fan of Pinecone and Vercel.
		START CONTEXT BLOCK
		${context}
		END OF CONTEXT BLOCK
		AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
		If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
		AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
		AI assistant will not invent anything that is not drawn directly from the context.
		`,
		},
	]

	const userMessages = messages.filter((message) => message.role === 'user')

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [...prompt, ...userMessages],
		stream: true,
	})

	const stream = OpenAIStream(response, {
		onStart: async () => {
			await db.insert(_messages).values({
				chatId,
				role: 'user',
				content: lastMessage.content!,
			})
		},
		onCompletion: async (completion) => {
			await db.insert(_messages).values({
				chatId,
				role: 'system',
				content: completion,
			})
		},
	})

	return new StreamingTextResponse(stream)
}
