import { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TailwindIndicator } from '@/components/tailwind-indicator'

import '@/styles/globals.css'

import ReactQueryProvider from '@/components/providers/react-query-provider'

export const metadata: Metadata = {
	title: {
		template: '%s | Doconvo',
		default: 'Doconvo',
	},
	description: 'Doconvo is a platform that lets you chat with pdfs.',
}

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<ClerkProvider>
			<ReactQueryProvider>
				<html lang='en' suppressHydrationWarning>
					<body
						className={cn(
							'min-h-screen bg-background font-sans antialiased',
							fontSans.variable
						)}
					>
						<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
							{children}
							<Toaster />
							<TailwindIndicator />
						</ThemeProvider>
					</body>
				</html>
			</ReactQueryProvider>
		</ClerkProvider>
	)
}
