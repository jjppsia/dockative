type PdfViewerProps = {
	pdfUrl: string
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
	return (
		<aside className='fixed inset-y-0 right-0 hidden w-[calc((100%-18rem)/2)] border-l px-4 py-6 sm:px-6 lg:px-8 xl:block'>
			<iframe
				src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
				className='h-full w-full'
			/>
		</aside>
	)
}
