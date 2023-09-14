import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import Chat from '@/components/chat'
import PdfViewer from '@/components/pdf-viewer'
import Sidebar from '@/components/side-bar'

type ChatPageProps = {
	params: {
		chatId: string
	}
}

export default async function Example({ params: { chatId } }: ChatPageProps) {
	const { userId } = auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
	const isChatExist = _chats.find((chat) => chat.id === parseInt(chatId))

	if (!_chats || !isChatExist) {
		redirect('/')
	}

	return (
		<>
			<Sidebar chatId={parseInt(chatId)} chats={_chats} />
			<Chat />
			<PdfViewer />
		</>
	)
}
