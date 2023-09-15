/* eslint-disable no-console */
import { env } from '@/env.mjs'
import AWS from 'aws-sdk'

export const uploadToS3 = async (file: File) => {
	try {
		AWS.config.update({
			accessKeyId: env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
			secretAccessKey: env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
		})

		const s3 = new AWS.S3({
			params: {
				Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
			},
			region: env.NEXT_PUBLIC_S3_REGION,
		})

		const fileName = `${Date.now().toString()}-${file.name.replace(' ', '-')}`
		const fileKey = `uploads/${fileName}`

		const upload = s3
			.putObject({
				Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
				Key: fileKey,
				Body: file,
			})
			.on('httpUploadProgress', (progress) => {
				const progressPercentage = Math.round(
					(progress.loaded * 100) / progress.total
				)

				console.log(`Uploading to S3: ${progressPercentage}%`)
			})
			.promise()

		await upload.then(() =>
			console.log(`Successfully uploaded to S3: ${fileName}`)
		)

		return Promise.resolve({
			fileKey,
			fileName: file.name,
		})
	} catch (error) {
		console.error(error)
	}
}

export const getS3Url = (fileKey: string) => {
	const url = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileKey}`

	return url
}
