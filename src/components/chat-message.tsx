import { Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

type ChatMessageProps = {
	messages: Message[]
	isLoading: boolean
}

export default function ChatMessage({ messages, isLoading }: ChatMessageProps) {
	if (isLoading) {
		return (
			<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
				<Icons.loader2 className='h-6 w-6 animate-spin' />
				<span className='sr-only'>Loading</span>
			</div>
		)
	}

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
									? 'max-w-[80%] bg-primary text-primary-foreground md:max-w-[60%] xl:max-w-[80%] 2xl:max-w-[48%]'
									: 'max-w-[80%] bg-secondary md:max-w-[60%] xl:max-w-[90%] 2xl:max-w-[48%]'
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
