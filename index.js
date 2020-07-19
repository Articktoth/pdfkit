
const PDFDocument = require('pdfkit');
const fs = require('fs');

const testjson = require('./test.json');

const doc = new PDFDocument({
    size: [350, 350],
    margins: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    }
});

const datosEmisor = testjson.Documento.Encabezado.Emisor;
const idDoc = testjson.Documento.Encabezado.IdDoc;
const items = testjson.Documento.Detalle;

doc.pipe(fs.createWriteStream('./tests/test.pdf'));

doc
    .fontSize(10)
    .text(datosEmisor.RznSoc, { align: "center" })
    .text(`${datosEmisor.DirOrigen} ${datosEmisor.CmnaOrigen} ${datosEmisor.CiudadOrigen}`)
    .text(datosEmisor.GiroEmis)
    .text(`FECHA EMISION : ${idDoc.FchEmis}`)
    .moveDown();

for (item of items) {
    doc.text(`${item.NmbItem} ${item.PrcItem}`);
}



doc
    .text(`DEBITO ONLINE:  ${testjson.Adicionales.debitoOnline}`)
    .text(`TOTAL:  ${testjson.Adicionales.debitoOnline}`)
    .moveDown()
    .text(`ATENDIDO POR: ${testjson.Adicionales.atendidoPor}`);



doc.end();

// console.log(table.rows)
