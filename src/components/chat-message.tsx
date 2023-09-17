import React from 'react'
import { Message } from 'ai/react'

import { cn } from '@/lib/utils'

type ChatMessageProps = {
	messages: Message[]
}

export default function ChatMessage({ messages }: ChatMessageProps) {
	return (
		<div className='flex flex-col space-y-6'>
			{messages.map((message) => {
				return (
					<div
						key={message.id}
						className={cn(
							'flex',
							message.role === 'user' ? 'justify-end' : 'justify-start'
						)}
					>
						<div
							className={cn(
								'rounded-lg border p-2 text-sm shadow-md',
								message.role === 'user'
									? 'max-w-[48%] bg-primary text-primary-foreground'
									: 'max-w-[48%] bg-secondary'
							)}
						>
							<p>{message.content}</p>
						</div>
					</div>
				)
			})}
		</div>
	)
}
