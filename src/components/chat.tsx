'use client'

import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Message } from 'ai'
import { useChat } from 'ai/react'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ChatMessage from '@/components/chat-message'
import { Icons } from '@/components/icons'

type ChatProps = {
	chatId: number
}

export default function Chat({ chatId }: ChatProps) {
	const lastMessageRef = useRef<HTMLDivElement>(null)

	const { data, isLoading } = useQuery({
		queryKey: ['chat', chatId],
		queryFn: async () => {
			const response = await axios.post<Message[]>('/api/get-messages', {
				chatId,
			})

			return response.data
		},
	})

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading: isGeneratingResponse,
	} = useChat({
		api: '/api/chat',
		body: { chatId },
		initialMessages: data,
	})

	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<main className='lg:pl-72'>
			<div className='xl:pr-[calc(100%/2)]'>
				<div className='relative flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-6'>
					<div className='flex-1'>
						<ChatMessage messages={messages} isLoading={isLoading} />
						<div ref={lastMessageRef} />
					</div>

					<footer className='sticky inset-x-0 bottom-6 mx-auto mt-10 w-full max-w-xl lg:mt-6'>
						<form
							onSubmit={handleSubmit}
							className='relative flex items-center'
						>
							<Input
								type='text'
								value={input}
								className='pr-10 shadow-md'
								placeholder={
									isGeneratingResponse
										? 'Generating response... '
										: 'Send a message'
								}
								onChange={handleInputChange}
								required
							/>
							<div className='absolute inset-y-0 right-[1px] top-[1px] my-auto'>
								{isGeneratingResponse ? (
									<div className='inline-flex h-10 w-10 items-center justify-center'>
										<Icons.loader2 className='h-4 w-4 animate-spin' />
										<span className='sr-only'>Loading</span>
									</div>
								) : (
									<Button variant='ghost' size='icon'>
										<Icons.send className='h-4 w-4' aria-hidden='true' />
										<span className='sr-only'>Send</span>
									</Button>
								)}
							</div>
						</form>
					</footer>
				</div>
			</div>
		</main>
	)
}
