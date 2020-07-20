const PDFDocument = require('pdfkit');
const fs = require('fs');

const testjson = require('./test.json');

const doc = new PDFDocument(
    {
        size: [226, 300],
        margins: {
            top: 20,
            bottom: 20,
            left: 10,
            right: 10
        }
    }
);

const datosEmisor = testjson.Documento.Encabezado.Emisor;
const idDoc = testjson.Documento.Encabezado.IdDoc;
const items = testjson.Documento.Detalle;

doc.pipe(fs.createWriteStream('./tests/testimage5.pdf'));

doc
    .fontSize(10)
    .text(datosEmisor.RznSoc, { align: "center" })
    .text(`${datosEmisor.DirOrigen} ${datosEmisor.CmnaOrigen} ${datosEmisor.CiudadOrigen}` , { align: "left" })
    .text(datosEmisor.GiroEmis, { align: "left" })
    .text(`FECHA EMISION : ${idDoc.FchEmis}`, { align: "left" })
    .moveDown();

for (item of items) {
    doc.text(`${item.NmbItem} ${item.PrcItem}`, { align: "left" });
}



doc
    .text(`DEBITO ONLINE:  ${testjson.Adicionales.debitoOnline}`, { align: "left" })
    .text(`TOTAL:  ${testjson.Adicionales.debitoOnline}`, { align: "left" })
    .moveDown()
    .text(`ATENDIDO POR: ${testjson.Adicionales.atendidoPor}`, { align: "left" })
    .moveDown();
    
doc.image('images/test2.png',{
    fit: [200, 300],
    align: 'center'
});

doc.end();

// console.log(table.rows)
