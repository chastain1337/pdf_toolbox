const PDFDocument = require("pdfkit");
const fs = require("fs")

for (i = 0; i <= 30; i++) {
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream(`sample_pdfs/sample_pdf_${i}.pdf`));
    doc.text(`This is the sample text for Sample PDF #${i}`,30,30);
    doc.end()
}