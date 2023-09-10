'use client'

import { useDropzone } from 'react-dropzone'

import { Icons } from '@/components/icons'

export default function FileUpload() {
	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'application/pdf': ['.pdf'] },
		maxFiles: 1,
	})

	return (
		<div className='rounded-[20px] border bg-background p-2'>
			<div
				{...getRootProps({
					className:
						'flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed',
				})}
			>
				<input {...getInputProps()} />
				<Icons.inbox className='h-8 w-8' />
				<p className='mt-2'>
					Drag and drop your PDF here, or click to select a file
				</p>
			</div>
		</div>
	)
}
