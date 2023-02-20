/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable array-callback-return */

const PDFDocument = require('pdf-lib').PDFDocument

export const mergePdftk = async pdfsToMerge => {
  const mergedPdf = await PDFDocument.create()
  for (const pdfBytes of pdfsToMerge) {
    const pdf = await PDFDocument.load(pdfBytes)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach(page => {
      mergedPdf.addPage(page)
    })
  }

  const buf = await mergedPdf.save()
  return buf
}
