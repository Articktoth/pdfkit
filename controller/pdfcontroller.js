const express = require('express');
const app = express();

const PDFDocument = require('../pdfkit-tables');
const fs = require('fs');
const testjson = require('../test.json');


app.post('/create-pdf', (req, res) => {
    const razonSocial = req.body.razonSocial;
    const dirOrigen = req.body.dirOrigen;
    const giroEmisor = req.body.giroEmisor;

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

    const idDoc = testjson.Documento.Encabezado.IdDoc;
    const items = testjson.Documento.Detalle;

    doc.pipe(fs.createWriteStream('./tests/testpostman.pdf'));

    doc
        .fontSize(10)
        .text(`${razonSocial}`, { align: "center" })
        .text(`${dirOrigen}`, { align: "left" })
        .text(`${giroEmisor}`, { align: "left" })
        .text(`FECHA EMITIDA : ${idDoc.FchEmis}`, { align: "left" })
        .moveDown();

        for (i = 0; i < items.length; i++) {
            const item = items[i];
            const position = 100 + (i + 1) * 10;
            doc
                .text(item.NmbItem, 10, position)
                .text(item.PrcItem, 10, position, { align: 'right' });
        }
        doc.moveDown();
        
        doc
            .text('DEBITO', 10, 200)
            .text('precio', 10, 200, { align: 'right' })
            .text('TOTAL', 10, 210,)
            .text('PRECIO', 10, 210, { align: 'right' });

    // doc
    //     .text(`DEBITO ONLINE:  ${testjson.Adicionales.debitoOnline}`, { align: "left" })

    //     .text(`${item.NmbItem}:  ${item.PrcItem}`, { width: 100, align: 'left' })
    //     .text(`${item.PrcItem}`, 50, 50, { width: 100, align: 'right' })

    //     .text(`TOTAL:  ${testjson.Adicionales.debitoOnline}`, { align: "left" })
    //     .moveDown()
    //     .text(`ATENDIDO POR: ${testjson.Adicionales.atendidoPor}`, { align: "left" })
    //     .moveDown();

    doc.image('images/test2.png', {
        fit: [200, 300],
        align: 'center'
    });

    doc.end();

    res.json({
        razonSocial,
        dirOrigen,
        giroEmisor
    });

});

module.exports = app;