'use client'

import { useChat } from 'ai/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ChatMessage from '@/components/chat-message'
import { Icons } from '@/components/icons'

type ChatProps = {
	chatId: number
}

export default function Chat({ chatId }: ChatProps) {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/chat',
		body: { chatId },
	})

	return (
		<main className='lg:pl-72'>
			<div className='xl:pr-[calc(100%/2)]'>
				<div className='relative flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-6'>
					<div className='flex-1'>
						<ChatMessage messages={messages} />
					</div>

					<footer className='sticky inset-x-0 bottom-6 mx-auto mt-10 w-full max-w-xl lg:mt-6'>
						<form
							onSubmit={handleSubmit}
							className='relative flex items-center'
						>
							<Input
								type='text'
								value={input}
								className='shadow-md'
								placeholder='Send a message'
								onChange={handleInputChange}
							/>
							<Button
								variant='ghost'
								size='sm'
								className='absolute right-4 h-auto p-1'
							>
								<Icons.send className='h-4 w-4' aria-hidden='true' />
								<span className='sr-only'>Send</span>
							</Button>
						</form>
					</footer>
				</div>
			</div>
		</main>
	)
}
