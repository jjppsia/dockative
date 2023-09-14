'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { UploadDropzone } from '@uploadthing/react'
import axios from 'axios'
import toast from 'react-hot-toast'

import { cn } from '@/lib/utils/cn'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { OurFileRouter } from '@/app/api/uploadthing/core'

export default function FileUpload() {
	const router = useRouter()
	const { mutate } = useMutation({
		mutationFn: async ({
			fileKey,
			fileName,
			fileUrl,
		}: {
			fileKey: string
			fileName: string
			fileUrl: string
		}) => {
			const response = await axios.post('/api/create-chat', {
				fileKey,
				fileName,
				fileUrl,
			})

			return response.data
		},
	})

	return (
		<div className='cursor-pointer rounded-2xl border p-2'>
			<UploadDropzone<OurFileRouter>
				content={{
					label: 'Choose a PDF file or drag it here',
					allowedContent: 'PDF (4MB)',
					button: ({ isUploading }) => {
						return isUploading ? (
							<Icons.loader2 className='h-4 w-4 animate-spin' />
						) : null
					},
				}}
				appearance={{
					container: ({ isUploading }) =>
						cn(
							'mt-0 border-border ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
							isUploading && 'cursor-not-allowed'
						),
					uploadIcon: 'text-muted-foreground',
					label: 'text-foreground pointer-events-none',
					allowedContent: 'text-muted-foreground',
					button: ({ isUploading }) =>
						cn(
							buttonVariants({ size: 'sm' }),
							isUploading && 'after:content-none'
						),
				}}
				endpoint='pdfUploader'
				onClientUploadComplete={(res) => {
					toast.success('File uploaded successfully!')

					if (!res) {
						toast.error('Something went wrong.')
						return
					}

					const { key: fileKey, name: fileName, url: fileUrl } = res[0]

					mutate(
						{ fileKey, fileName, fileUrl },
						{
							onSuccess: ({ data, status }) => {
								switch (status) {
									case 200:
										toast.success('Chat created successfully!')
										router.push(`/chat/${data.chatId}`)
										break
									case 429:
										toast.error('Rate limit reached for requests')
										break
									default:
										toast.error('There was an error creating the chat.')
								}
							},
							onError: (error) => {
								// eslint-disable-next-line no-console
								console.error(error)
								toast.error('There was an error creating the chat.')
							},
						}
					)
				}}
				onUploadError={(error) => toast.error(error.message)}
			/>
		</div>
	)
}
