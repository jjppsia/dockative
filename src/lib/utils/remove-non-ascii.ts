export const removeNonAscii = (str: string) => str.replace(/[^\x00-\x7F]+/g, '')
