const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

function createPdfWide(datajson, plantilla, timbrepng) {

    const docConfig = plantilla.Plantilla.Documento;
    const items = datajson.Documento.Detalle;
    const heightBase = 350;
    const altoLinea = 10;
    const height = items.reduce((acc, curr) => acc + (curr.NmbItem.length > 24 ? 2 * altoLinea : altoLinea), heightBase);

    console.log(height)


    console.log("Total items: ", items.length)

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
    generateDetails(doc, datajson, plantilla, timbrepng, docConfig);
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
        .text(`FOLIO: ${datajson.Documento.Encabezado.IdDoc.Folio}`);

    const array = datajson.Documento.Encabezado.IdDoc.FchEmis.split('-');
    const fechaFormato = `${array[2]}/${array[1]}/${array[0]}`;

    doc.font(docHead.Fecha.font)
        .text(`FECHA EMISION: ${fechaFormato}`, { align: docHead.Fecha.align })
        .moveDown();
}

const optimizaSaltoLinea = (NmbItem, anchoMaximo) => {
    return (
        NmbItem.slice(anchoMaximo, anchoMaximo + 1) !== ' ' ?
            NmbItem.slice(0, anchoMaximo) + ' ' + NmbItem.slice(anchoMaximo, anchoMaximo * 2) :
            NmbItem.slice(0, anchoMaximo * 2)
    )
}

function generateDetails(doc, datajson, plantilla) {
    const docDetails = plantilla.Plantilla.Details;
    const position = 100;

    const items = datajson.Documento.Detalle;

    doc
        .font(docDetails.Items.font)
        .text("Descripción", 10, position, { align: "left" })
        .text("Unidad", 143, position)
        .text("Precio", 180, position)
        .text("Dscto", 230, position)
        .text("Valor", 280, position)
        .moveDown();

    let base = 110;

    for (var i = 0; i < items.length; i++) {
        const item = items[i];
        let position = base + 10;
        base = position;

        const nmb = optimizaSaltoLinea(item.NmbItem, 24)

        let discount = item.DescuentoPct == undefined ? "Sin Dscto" : item.DescuentoPct + "%";
        doc
            .fontSize(8)
            .text(nmb.slice(0, 50), 10, position, { width: 130 })
            .text(item.QtyItem, 145, position)
            .text(item.PrcItem, 180, position)
            .text(`${discount}`, 230, position)
            .text(format(item.MontoItem), 280, position, { align: docDetails.Precio.align })

        if (nmb.length > 24) {
            base = base + 10;
        }
    }
    doc.moveDown();

}

function generateTotales(doc, datajson, plantilla, position) {
    let docTotals = plantilla.Plantilla.Totales;

    doc
        .text("TOTAL", 150, position, { lineBreak: false })
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

    doc.image(timbrepng, 10, doc.page.height - 170, {
        fit: [docConfig.size.width, 160],
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
    createPdfWide
}