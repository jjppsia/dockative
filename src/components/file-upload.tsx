'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

import { uploadToS3 } from '@/lib/s3/client'
import { Icons } from '@/components/icons'
import { CreateChatSchema } from '@/app/api/create-chat/route'

export default function FileUpload() {
	const [isUploading, setIsUploading] = useState(false)
	const router = useRouter()

	const { mutate, isLoading } = useMutation({
		mutationFn: async ({ fileKey, fileName }: CreateChatSchema) => {
			const reponse = await axios.post('/api/create-chat', {
				fileKey,
				fileName,
			})

			return reponse.data
		},
	})

	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'application/pdf': ['.pdf'] },
		maxFiles: 1,
		maxSize: 4 * 1024 * 1024,
		onDropRejected: (fileRejections) => {
			const { errors } = fileRejections[0]

			switch (errors[0].code) {
				case 'file-too-large':
					toast.error('File size must be less than 4MB.')
					break
				case 'file-invalid-type':
					toast.error('File type must be PDF.')
					break
				case 'too-many-files':
					toast.error('Only one file can be uploaded at a time.')
					break
				default:
					toast.error('There was an error uploading your file.')
			}
		},
		onDropAccepted: async (acceptedFiles) => {
			const file = acceptedFiles[0]

			try {
				setIsUploading(true)

				const result = await uploadToS3(file)

				if (!result) {
					toast.error('There was an error uploading your file.')
					return
				}

				mutate(result, {
					onSuccess: ({ chatId }) => {
						toast.success('Chat created successfully!')
						router.push(`/chats/${chatId}`)
					},
					onError: () => toast.error('There was an error creating your chat.'),
				})
			} catch (error) {
				toast.error('There was an error uploading your file.')
			} finally {
				setIsUploading(false)
			}
		},
	})

	return (
		<div className='rounded-[20px] border bg-background p-2'>
			<div
				{...getRootProps({
					className:
						'flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				})}
			>
				<input {...getInputProps()} />
				{isUploading || isLoading ? (
					<>
						<Icons.loader2 className='h-8 w-8 animate-spin text-primary' />
						<p className='mt-3'>
							{isUploading ? 'Uploading your file...' : 'Creating your chat...'}
						</p>
					</>
				) : (
					<>
						<Icons.fileBox className='h-8 w-8' />
						<p className='mt-3'>Choose a file or drag it here.</p>
						<small className='text-xs'>PDF (4MB max)</small>
					</>
				)}
			</div>
		</div>
	)
}
