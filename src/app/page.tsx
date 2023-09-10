import Image from 'next/image'
import Link from 'next/link'
import { auth, UserButton } from '@clerk/nextjs'

import { buttonVariants } from '@/components/ui/button'
import FileUpload from '@/components/file-upload'
import { Icons } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RootPage() {
	const { userId } = auth()

	const isAuthenticated = !!userId

	return (
		<>
			<header className='absolute inset-x-0 top-0 z-50'>
				<div className='flex items-center justify-between p-6 lg:px-8'>
					<div className='flex flex-1 justify-end'>
						{isAuthenticated ? (
							<UserButton afterSignOutUrl='/' />
						) : (
							<div className='space-x-4'>
								<Link
									href='/sign-in'
									className={buttonVariants({ variant: 'ghost' })}
								>
									Sign in
								</Link>
								<Link href='/sign-up' className={buttonVariants()}>
									Get started
									<Icons.arrowRight className='ml-2 h-4 w-4' />
								</Link>
							</div>
						)}
					</div>
				</div>
			</header>
			<main className='isolate'>
				<div className='relative pt-14'>
					<div
						className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
						aria-hidden='true'
					>
						<div
							className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
							style={{
								clipPath:
									'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
							}}
						/>
					</div>
					<div className='py-24 sm:py-32'>
						<div className='mx-auto max-w-7xl px-6 lg:px-8'>
							<div className='mx-auto max-w-2xl'>
								<h1 className='text-center text-4xl font-bold tracking-tight sm:text-6xl'>
									Chat with any PDF
								</h1>
								<p className='mt-6 text-lg leading-8 text-muted-foreground'>
									Join millions of students, researchers and professionals to
									instantly answer{' '}
									<span className='block text-center'>
										questions and understand research with AI.
									</span>
								</p>
								{isAuthenticated && (
									<div className='mt-10'>
										<FileUpload />
									</div>
								)}
							</div>
							<div className='mt-16 flow-root sm:mt-24'>
								<div className='-m-2 rounded-xl bg-secondary p-2 ring-1 ring-inset ring-border lg:-m-4 lg:rounded-2xl lg:p-4'>
									<Image
										src='/assets/chat-pdf.png'
										alt='Image of a chat using ChatPDF'
										width={1906}
										height={930}
										className='rounded-md shadow-2xl ring-1 ring-gray-900/10'
										priority
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<footer>
				<div className='mx-auto max-w-7xl border-t py-12'>
					<div className='flex items-center justify-between'>
						<p className='justify-center text-xs text-muted-foreground'>
							&copy; 2023 Ron Ron Pog, Co. All rights reserved.
						</p>
						<ThemeToggle className='-mr-3 self-end' size='sm' variant='ghost' />
					</div>
				</div>
			</footer>
		</>
	)
}
