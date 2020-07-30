const PDFDocument = require('pdfkit');
const fs = require('fs');

function createPdf(datajson, path, body, plantilla) {

    let docConfig = plantilla.Plantilla.Documento;

    docConfig.width, docConfig.height = parseInt();
    const doc = new PDFDocument(
        {
            size: [docConfig.size.width, docConfig.size.height],
            margins: {
                top: docConfig.margins.top,
                bottom: docConfig.margins.bottom,
                left: docConfig.margins.left,
                right: docConfig.margins.right
            }
        }
    );


    generateHeader(doc, datajson, body, plantilla);
    generateDetails(doc, datajson, plantilla);
    generateTotales(doc, datajson, plantilla);
    generateFooter(doc, plantilla);
    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, datajson, body, plantilla) {
    let docHead = plantilla.Plantilla.Encabezado;

    doc
        .font(docHead.RazonSoc.font)
        .text(body.razonSocial, { align: docHead.RazonSoc.align })
        .moveDown()
    doc
        .text(body.rut, { align: docHead.Rut.align })
        .text(datajson.Documento.Encabezado.Emisor.DirOrigen, { align: docHead.DirOrigen })
        .text(`FOLIO: ${datajson.Documento.Encabezado.IdDoc.Folio}`)
        .text(datajson.Documento.Encabezado.IdDoc.FchEmis, { align: docHead.Fecha.align })
        .moveDown();
}

function generateDetails(doc, datajson, plantilla) {
    let docDetails = plantilla.Plantilla.Details;

    const items = datajson.Documento.Detalle;
    for (i = 0; i < items.length; i++) {
        const item = items[i];
        const position = 100 + (i + 1) * 10;
        doc
            .text(item.NmbItem, 10, position)
            .text(item.PrcItem, 10, position, { align: docDetails.Precio.align });
    }
    doc.moveDown();
}

function generateTotales(doc, datajson, plantilla) {
    let docTotals = plantilla.Plantilla.Totales;

    doc
        .font(docTotals.Total)
        .text(`El IVA de esta boleta es ${datajson.Documento.Encabezado.Totales.IVA}`, { align: docTotals.align })
        .moveDown();
}



function generateFooter(doc, plantilla) {
    let docConfig = plantilla.Plantilla.Documento;

    let docFooter = plantilla.Plantilla.FooterTimbre;


    doc.image('images/test.png', 10, docConfig.size.height - 150, {
        fit: [200, 150],
        align: docFooter.align
    })
        .text("Timbre", 10, docConfig.size.height - 40, { align: "center" });
}


module.exports = {
    createPdf
}