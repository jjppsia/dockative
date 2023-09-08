import { ThemeToggle } from '@/components/theme-toggle'

export default function RootPage() {
	return (
		<main className='flex h-full flex-col items-center justify-center'>
			<h1 className='text-4xl font-semibold'>Hello 🌏</h1>
			<ThemeToggle className='mt-4' />
		</main>
	)
}
