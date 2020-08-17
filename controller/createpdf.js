const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

function createPdf(datajson, plantilla, timbrepng){

    const docConfig = plantilla.Plantilla.Documento;
    const items = datajson.Documento.Detalle;
    const heightBase = 280;
    const altoLinea = 10;
    const height = items.reduce((acc, curr) => acc + (curr.NmbItem.length > 24 ? 2 * altoLinea : altoLinea), heightBase);

    console.log("height: ", height)
    console.log("length items: ", items.length)

    const doc = new PDFDocument (
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
        .text(`RUT: ${datajson.Documento.Encabezado.Emisor.RUTEmisor}`, { align: docHead.Rut.align })
        .moveDown();

    doc
        .fontSize(10)
        .font(docHead.Folio.font)
        .text(`BOLETA ELECTRONICA No.${datajson.Documento.Encabezado.IdDoc.Folio}`);

    const array = datajson.Documento.Encabezado.IdDoc.FchEmis.split('-');
    const fechaFormato = `${array[2]}/${array[1]}/${array[0]}`;

    doc.font(docHead.Fecha.font)
        .text(`FECHA EMISION: ${fechaFormato}`, { align: docHead.Fecha.align })
        .moveDown();
}
//Error genera un espacio más en el caracter 24. Ej: "TERMÓMETRO PLANO PLANO P LANO CLÍNICO"
// const optimizaSaltoLinea = (NmbItem, anchoMaximo) => {    
//     return (
//         NmbItem.slice(anchoMaximo, anchoMaximo + 1) !== ' ' ? 
//             NmbItem.slice(0, anchoMaximo) + ' ' + NmbItem.slice(anchoMaximo, anchoMaximo * 2) : 
//             NmbItem.slice(0, anchoMaximo * 2)
//     )
// }

function generateDetails(doc, datajson, plantilla) {
    const docDetails = plantilla.Plantilla.Details;
    const position = 90;

    const items = datajson.Documento.Detalle;

    doc
        .font(docDetails.Items.font)
        .text("CANTIDAD", 10, position, { align: "left" })
        .text("DESCRIPCION", 10, position, { align: "center" })
        .text("VALOR", 10, position, { align: "right" })

    doc
        .font(docDetails.Items.font)
        .text(`----------------------------------`)

    let base = 100
    for (var i = 0; i < items.length; i++) {
        const item = items[i];
        let position = base + 10;
        base = position

        // const nmb = optimizaSaltoLinea(item.NmbItem, 24)

        // console.log("item ", nmb)
        // console.log("base ", base)
        // console.log("position ", position)

        doc
            .fontSize(8)
            .text(item.QtyItem, 20, position)
            .text(item.NmbItem.slice(0, 42), 45, position, { width: 120 })
            .text(format(item.MontoItem), 10, position, { align: docDetails.Precio.align })

        if (item.NmbItem.length > 24) {
            base = base + 10;
        }
    }
    doc.moveDown();
    doc
        .fontSize(10)
        .font(docDetails.Items.font)
        .text(`----------------------------------`)

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
    createPdf
}