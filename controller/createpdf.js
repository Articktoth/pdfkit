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

function generateDetails(doc, datajson, plantilla) {
    const docDetails = plantilla.Plantilla.Details;
    const position = 100;

    const items = datajson.Documento.Detalle;

    doc
        .font(docDetails.Items.font)
        .text("CANTIDAD", 10, position, { align: "left" })
        .text("DESCRIPCION", 10, position, { align: "center" })
        .text("VALOR", 10, position, { align: "right" })

    doc
        .font(docDetails.Items.font)
        .text(`----------------------------------`)

    for (i = 0; i < items.length; i++) {
        const item = items[i];
        const position = 100 + (i + 1) * 15;

        doc
            .fontSize(8)
            .text(item.QtyItem, 20, position, { lineBreak: false })
            .text(item.NmbItem.slice(0, 25), 10, position, { align: 'center' })
            .text(format(item.MontoItem), 10, position, { align: docDetails.Precio.align });
    }
    doc.moveDown();
    doc
        .fontSize(10)
        .font(docDetails.Items.font)
        .text(`----------------------------------`)

    generateTotales(doc, datajson, plantilla, undefined);
}

function generateTotales(doc, datajson, plantilla, position) {
    let docTotals = plantilla.Plantilla.Totales;

    doc
        .text("TOTAL", 10, position, { align: "left", lineBreak: false })
        .text(`$${format(datajson.Documento.Encabezado.Totales.MntTotal)}`, { align: "right" })
        .moveDown();
}

function generateFooter(doc, plantilla, docConfig, height, timbrepng, datajson) {

    let docFooter = plantilla.Plantilla.FooterTimbre;

    doc
        .font("Courier")
        .fontSize(8)
        .text(`El IVA de esta boleta es $${format(datajson.Documento.Encabezado.Totales.IVA)}`, { align: "left", lineBreak: false })
        .moveDown();

    doc.image(timbrepng, 10, height - 120, {
        fit: [docConfig.size.width - 10, 100],
        // width: docConfig.size.width,
        // height: 100,
        align: docFooter.align
    })
}

function format(monto){

    var num = monto.toString().replace(/\./g,'');
    if(!isNaN(monto)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
    }else{ 
        num =  monto.toString().replace(/[^\d\.]*/g,'')
    }

    return num
}



module.exports = {
    createPdf
}