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
    // generateTotales(doc, datajson, plantilla);
    generateFooter(doc, plantilla, docConfig, height, timbrepng, datajson);
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
        .fontSize(10)
        .font(docHead.RazonSoc.font)
        .text(datajson.Documento.Encabezado.Emisor.RznSocEmisor, { align: docHead.RazonSoc.align });
    doc

        .font(docHead.Rut.font)
        .text(datajson.Documento.Encabezado.Emisor.RUTEmisor, { align: docHead.DirOrigen })
        .moveDown();

    doc
        .fontSize(10)
        .font(docHead.Folio.font)
        .text(`FOLIO: ${datajson.Documento.Encabezado.IdDoc.Folio}`);

    doc.font(docHead.Fecha.font)
        .text(`FECHA EMISION: ${datajson.Documento.Encabezado.IdDoc.FchEmis}`, { align: docHead.Fecha.align })
        .moveDown();
}

function generateDetails(doc, datajson, plantilla) {
    const docDetails = plantilla.Plantilla.Details;
    const position = 100;

    const items = datajson.Documento.Detalle;

    doc
        .font(docDetails.Items.font)
        .text("CANTIDAD", 10, position, { align: "left" })
        .text("DESCRIPCION", 10, position, { align: "center" })
        .text("VALOR", 10, position, { align: "right" })

    for (i = 0; i < items.length; i++) {
        const item = items[i];
        const position = 100 + (i + 1) * 15;
        doc
            .text(item.QtyItem, 20, position)
            .text(item.NmbItem, 10, position, { align: 'center' })
            .text(item.PrcItem, 10, position, { align: docDetails.Precio.align });
    }
    doc.moveDown();
    generateTotales(doc, datajson, plantilla);
}

function generateTotales(doc, datajson, plantilla, position) {
    let docTotals = plantilla.Plantilla.Totales;

    doc
        .text("TOTAL",10, position, {align: "left", lineBreak: false})
        .text(datajson.Documento.Encabezado.Totales.MntTotal, {align: "right"})
        .moveDown();
}



function generateFooter(doc, plantilla, docConfig, height, timbrepng, datajson) {

    let docFooter = plantilla.Plantilla.FooterTimbre;

    doc
        .font("Courier-Bold")
        .text(`El IVA `, { align: "center", lineBreak: false })
        .font("Courier")
        .text(`de esta boleta es ${datajson.Documento.Encabezado.Totales.IVA}`)
        .moveDown();

    doc.image(timbrepng, 10, height - 120, {
        fit: [docConfig.size.width - 10, 100],
        // width: docConfig.size.width,
        // height: 100,
        align: docFooter.align
    })
}


module.exports = {
    createPdf
}