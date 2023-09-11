import { NextResponse } from 'next/server'
import { z } from 'zod'

const createChatSchema = z.object({
	file_key: z.string(),
	file_name: z.string(),
})

export async function POST(req: Request) {
	try {
		const json = await req.json()
		const body = createChatSchema.parse(json)

		return NextResponse.json({
			status: 200,
			message: 'Chat created successfully',
			data: body,
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
