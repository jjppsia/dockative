import fs from 'fs'
import os from 'os'
import { env } from '@/env.mjs'
import AWS from 'aws-sdk'

export const downloadFromS3 = async (fileKey: string) => {
	try {
		AWS.config.update({
			accessKeyId: env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
			secretAccessKey: env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
		})

		const s3 = new AWS.S3({
			params: {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			},
			region: process.env.NEXT_PUBLIC_S3_REGION,
		})

		const obj = await s3
			.getObject({
				Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
				Key: fileKey,
			})
			.promise()

		const tempFolderPath = os.tmpdir()
		const fileName = `${tempFolderPath}/pdf-${Date.now()}.pdf`

		fs.writeFileSync(fileName, obj.Body as Buffer)

		return fileName
	} catch (error) {
		throw new Error(`Error downloading PDF from S3: ${error}`)
	}
}
