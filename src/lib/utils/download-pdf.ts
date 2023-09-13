import fs from 'fs'
import os from 'os'
import axios from 'axios'

export const downloadPdf = async (pdfUrl: string, pdfName: string) => {
	try {
		const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' })
		const tempFolderPath = os.tmpdir()
		const filePath = `${tempFolderPath}/${pdfName}`

		fs.writeFileSync(`${tempFolderPath}/${pdfName}`, response.data)

		return filePath
	} catch (error) {
		throw new Error(`Error downloading PDF from Uploadthing: ${error}`)
	}
}
