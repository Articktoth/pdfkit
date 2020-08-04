const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

function createPdf(datajson, plantilla, timbrepng) {

    const docConfig = plantilla.Plantilla.Documento;
    const items = datajson.Documento.Detalle;
    const height = (items.length * 15) + 300;


    const doc = new PDFDocument(
        {
            size: [docConfig.size.width, height],
            margins: {
                top: docConfig.margins.top,
                bottom: docConfig.margins.bottom,
                left: docConfig.margins.left,
                right: docConfig.margins.right
            }
        }
    );

    const stream = doc.pipe(new streamBuffers.WritableStreamBuffer());
    //    doc.pipe(fs.createWriteStream(path));


    generateHeader(doc, datajson, plantilla);
    generateDetails(doc, datajson, plantilla);
    generateTotales(doc, datajson, plantilla);
    generateFooter(doc, plantilla, docConfig, height, timbrepng);
    doc.end();

    return new Promise((resolve, reject) => {
        const termino = () => {
            resolve(stream.getContents())
        }
        stream.on('finish', termino)
    })
}

function generateHeader(doc, datajson, plantilla) {
    let docHead = plantilla.Plantilla.Encabezado;

    doc
        .font(docHead.RazonSoc.font)
        .text(datajson.Documento.Encabezado.Emisor.RznSoc, { align: docHead.RazonSoc.align });
    doc
        .font(docHead.Rut.font)
        .text(datajson.Documento.Encabezado.Emisor.DirOrigen, { align: docHead.DirOrigen })

    doc
        .fontSize(10)
        .text(datajson.Adicionales.atendidoPor);

    doc 
        .fontSize(10)
        .font(docHead.Folio.font)
        .text(`FOLIO: ${datajson.Documento.Encabezado.IdDoc.Folio}`);
    
        doc.font(docHead.Fecha.font)
        .text(datajson.Documento.Encabezado.IdDoc.FchEmis, { align: docHead.Fecha.align })
        .moveDown();
}

function generateDetails(doc, datajson, plantilla) {
    const docDetails = plantilla.Plantilla.Details;

    const items = datajson.Documento.Detalle;
    for (i = 0; i < items.length; i++) {
        const item = items[i];
        const position = 100 + (i + 1) * 15;
        doc
            .text(item.NmbItem, 10, position)
            .text(item.PrcItem, 10, position, { align: docDetails.Precio.align });
    }
    doc.moveDown();
}

function generateTotales(doc, datajson, plantilla) {
    let docTotals = plantilla.Plantilla.Totales;

    doc
        .font(docTotals.font)
        .text(`El IVA de esta boleta es ${datajson.Documento.Encabezado.Totales.IVA}`, { align: docTotals.align })
        .moveDown();
}



function generateFooter(doc, plantilla, docConfig, height, timbrepng) {

    let docFooter = plantilla.Plantilla.FooterTimbre;


    doc.image(timbrepng, 10, height - 150, {
        fit: [docConfig.size.width - 10, 100],
        // width: docConfig.size.width,
        // height: 100,
        align: docFooter.align
    })
        .text("Timbre", 10, height - 40, { align: "center" });
}


module.exports = {
    createPdf
}