const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

function createPdfSinDetalle(datajson, plantilla, timbrepng){

    const docConfig = plantilla.Plantilla.Documento;
    const items = datajson.Documento.Detalle;
    const heightBase = 230;
    // const altoLinea = 10;
    // const height = items.reduce((acc, curr) => acc + (curr.NmbItem.length > 24 ? 2 * altoLinea : altoLinea), heightBase);

    const doc = new PDFDocument (
        {
            size: [docConfig.size.width, heightBase],
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
    generateTotales(doc, datajson, plantilla);
    doc.moveDown();
    generateFooter(doc, plantilla, docConfig, timbrepng, datajson);
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
        .text(datajson.Documento.Encabezado.Emisor.RUTEmisor, { align: docHead.Rut.align })
        .moveDown();

    doc
        .fontSize(10)
        .font(docHead.Folio.font)
        .text(`FOLIO: ${datajson.Documento.Encabezado.IdDoc.Folio}`);

    const array = datajson.Documento.Encabezado.IdDoc.FchEmis.split('-');
    const fechaFormato = `${array[2]}/${array[1]}/${array[0]}`;

    doc.font(docHead.Fecha.font)
        .text(`FECHA EMISION: ${fechaFormato}`, { align: docHead.Fecha.align })
        .moveDown();
}

function generateTotales(doc, datajson, plantilla, position) {
    let docTotals = plantilla.Plantilla.Totales;

    doc
        .text("TOTAL", 10, position, { align: "left", lineBreak: false })
        .text(`$${format(datajson.Documento.Encabezado.Totales.MntTotal)}`, { align: "right" })
        .moveDown();
        doc
        .font("Courier")
        .fontSize(8)
        .text(`El IVA de esta boleta es $${format(datajson.Documento.Encabezado.Totales.IVA)}`, { align: "left", lineBreak: false })
        .moveDown();
}

function generateFooter(doc, plantilla, docConfig, timbrepng, datajson) {

    let docFooter = plantilla.Plantilla.FooterTimbre;

    doc.image(timbrepng, 10, doc.page.height - 110, {
        fit: [docConfig.size.width - 10, 100],
        align: docFooter.align
    })
}

function format(monto) {

    var num = monto.toString().replace(/\./g, '');
    if (!isNaN(monto)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
    } else {
        num = monto.toString().replace(/[^\d\.]*/g, '')
    }

    return num
}



module.exports = {
    createPdfSinDetalle
}