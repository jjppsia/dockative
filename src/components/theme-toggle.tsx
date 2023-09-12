'use client'

import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

type ThemeToggleProps = React.ComponentProps<typeof Button> & {
	children?: React.ReactNode
}

export function ThemeToggle({
	className,
	variant,
	size,
	children,
	...props
}: ThemeToggleProps) {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			className={cn(className, 'justify-start')}
			variant={variant}
			size={size}
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			{...props}
		>
			<Icons.sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Icons.moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Toggle theme</span>
			{children}
		</Button>
	)
}
