'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Dialog, Transition } from '@headlessui/react'

import { Chat } from '@/lib/db/schema'
import { cn } from '@/lib/utils/cn'
import { Icons } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'

type SidebarProps = {
	chatId: number
	chats: Chat[]
}

export default function Sidebar({ chatId, chats }: SidebarProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-50 lg:hidden'
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={Fragment}
						enter='transition-opacity ease-linear duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='transition-opacity ease-linear duration-300'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-gray-900/80' />
					</Transition.Child>

					<div className='fixed inset-0 flex'>
						<Transition.Child
							as={Fragment}
							enter='transition ease-in-out duration-300 transform'
							enterFrom='-translate-x-full'
							enterTo='translate-x-0'
							leave='transition ease-in-out duration-300 transform'
							leaveFrom='translate-x-0'
							leaveTo='-translate-x-full'
						>
							<Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
								<Transition.Child
									as={Fragment}
									enter='ease-in-out duration-300'
									enterFrom='opacity-0'
									enterTo='opacity-100'
									leave='ease-in-out duration-300'
									leaveFrom='opacity-100'
									leaveTo='opacity-0'
								>
									<div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
										<button
											type='button'
											className='-m-2.5 p-2.5'
											onClick={() => setSidebarOpen(false)}
										>
											<span className='sr-only'>Close sidebar</span>
											<Icons.x
												className='h-6 w-6 text-white'
												aria-hidden='true'
											/>
										</button>
									</div>
								</Transition.Child>
								<div className='flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 py-3 pb-2'>
									{/* New chat button */}
									<Link
										href='/'
										className='-mx-2 flex items-center rounded-md border-2 p-2 text-sm font-semibold leading-6'
									>
										<Icons.plus className='mr-3 h-4 w-4 shrink-0' />
										New chat
									</Link>

									{/* Chat list */}
									<nav className='flex flex-1 flex-col'>
										<ul role='list' className='flex flex-1 flex-col gap-y-7'>
											<li>
												<ul role='list' className='-mx-2 space-y-3'>
													{chats.map((chat) => (
														<li key={chat.id}>
															<Link
																href={`/chat/${chat.id}`}
																scroll={false}
																className={cn(
																	chat.id === chatId
																		? 'bg-secondary text-foreground'
																		: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
																	'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
																)}
															>
																<Icons.messageSquare
																	className={cn(
																		chat.id === chatId
																			? 'text-foreground'
																			: 'text-muted-foreground group-hover:text-foreground',
																		'h-4 w-4 shrink-0'
																	)}
																	aria-hidden='true'
																/>
																{chat.pdfName}
															</Link>
														</li>
													))}
												</ul>
											</li>
										</ul>
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			<div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
				<div className='flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 py-3'>
					{/* New chat button */}
					<Link
						href='/'
						className='-mx-2 flex items-center rounded-md border-2 p-2 text-sm font-semibold leading-6'
					>
						<Icons.plus className='mr-3 h-4 w-4 shrink-0' />
						New chat
					</Link>

					{/* Chat list */}
					<nav className='flex flex-1 flex-col'>
						<ul role='list' className='flex flex-1 flex-col gap-y-7'>
							<li>
								<ul role='list' className='-mx-2 space-y-2'>
									{chats.map((chat) => (
										<li key={chat.id}>
											<Link
												href={`/chat/${chat.id}`}
												scroll={false}
												className={cn(
													chat.id === chatId
														? 'bg-secondary text-foreground'
														: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
													'group flex items-center rounded-md p-2 text-sm font-semibold leading-6'
												)}
											>
												<Icons.messageSquare
													className={cn(
														chat.id === chatId
															? 'text-foreground'
															: 'text-muted-foreground group-hover:text-foreground',
														'mr-3 h-4 w-4 shrink-0'
													)}
													aria-hidden='true'
												/>
												<span className='truncate' title={chat.pdfName}>
													{chat.pdfName}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</li>
							<li className='-mx-2 mt-auto flex items-center justify-between'>
								<ThemeToggle size='sm' variant='ghost' />
								<UserButton afterSignOutUrl='/' />
							</li>
						</ul>
					</nav>
				</div>
			</div>

			{/* Topbar */}
			<div className='sticky top-0 z-40 flex items-center gap-x-6 p-4 shadow-sm sm:px-6 lg:hidden'>
				<button
					type='button'
					className='-m-2.5 p-2.5 lg:hidden'
					onClick={() => setSidebarOpen(true)}
				>
					<span className='sr-only'>Open sidebar</span>
					<Icons.menu className='h-6 w-6' aria-hidden='true' />
				</button>
				<div className='flex-1 text-sm font-semibold leading-6'>Dashboard</div>

				<ThemeToggle size='sm' variant='ghost' />
				<UserButton afterSignOutUrl='/' />
			</div>
		</>
	)
}
