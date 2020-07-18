const PDFDocument = require('pdfkit');
const fs = require('fs');

const testjson = require('./test.json');

const doc = new PDFDocument({
    size: [200, 350],
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

doc.pipe(fs.createWriteStream('./tests/test2.pdf'));

doc
    .fontSize(10)
    .text(datosEmisor.RznSoc, {align: "center"})
    .moveDown()
    .text(`${datosEmisor.DirOrigen} ${datosEmisor.CmnaOrigen} ${datosEmisor.CiudadOrigen}`)
    .text(datosEmisor.GiroEmis)
    .text(`FECHA EMISION : ${idDoc.FchEmis}`);

const table = {
    rows: []
};

for (item of items) {
    doc.text(item.NmbItem)
}


doc.end();

// console.log(table.rows)
