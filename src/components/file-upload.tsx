'use client'

import { UploadDropzone } from '@uploadthing/react'

import '@uploadthing/react/styles.css'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { OurFileRouter } from '@/app/api/uploadthing/core'

export default function FileUpload() {
	const { mutate } = useMutation({
		mutationFn: async ({
			file_key,
			file_name,
		}: {
			file_key: string
			file_name: string
		}) => {
			const response = await axios.post('/api/create-chat', {
				file_key,
				file_name,
			})

			return response.data
		},
	})

	return (
		<div className='cursor-pointer rounded-2xl border p-2'>
			<UploadDropzone<OurFileRouter>
				className='mt-0 border-border ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
				content={{
					label: 'Choose a PDF file or drag it here',
					allowedContent: 'PDF (8MB)',
				}}
				appearance={{
					uploadIcon: 'text-muted-foreground',
					label: 'text-foreground pointer-events-none',
					allowedContent: 'text-muted-foreground',
					button: ({ isUploading }) =>
						cn(
							buttonVariants({ size: 'sm' }),
							isUploading && 'after:bg-green-500'
						),
				}}
				endpoint='pdfUploader'
				onClientUploadComplete={(res) => {
					if (!res) {
						return toast.error('There was an error uploading the file.')
					}

					const { key: file_key, name: file_name } = res[0]

					mutate(
						{ file_key, file_name },
						{
							onSuccess: () => toast.success('Chat created successfully!'),
							onError: () =>
								toast.error('There was an error creating the chat.'),
						}
					)
				}}
				onUploadError={(error: Error) => toast.error(error.message)}
			/>
		</div>
	)
}
