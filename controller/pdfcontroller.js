const express = require('express');
const app = express();

const PDFDocument = require('pdfkit');
const fs = require('fs');
const testjson = require('../test.json');


app.post('/create-pdf', (req, res) => {
    const razonSocial = req.body.razonSocial;
    const rut = req.body.rut;
    const giroEmisor = req.body.giroEmisor;
    const options = req.body.options;
    const details = req.body.details;
    console.log(details)

    const doc = new PDFDocument(
        {
            size: [226, 400],
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

    doc.pipe(fs.createWriteStream(`./tests/ifdetailsfalse.pdf`));

    doc
        .fontSize(10)
        .text(`${razonSocial}`, { align: `${options.option1}` })
        .text(`${rut}`, { align: `${options.option2}` })
        .text(`${giroEmisor}`, { align: `${options.option3}` })
        .text(`FECHA EMISION: ${idDoc.FchEmis}`, { align: "left" })
        .moveDown();

    //DEtalles
        if (details == true) {
        for (i = 0; i < items.length; i++) {
            const item = items[i];
            const position = 100 + (i + 1) * 10;
            doc
                .text(item.NmbItem, 10, position)
                .text(item.PrcItem, 10, position, { align: 'right' });
        }
    }

    doc.moveDown();

    doc
        .text('DEBITO', 10, 200)
        .text('precio', 10, 200, { align: 'right' })
        .text('TOTAL', 10, 210,)
        .text('PRECIO', 10, 210, { align: 'right' });

    doc.image('images/test.png', {
        fit: [200, 150],
        align: 'left'
    });

    doc.end();

    res.json({
        razonSocial,
        rut,
        giroEmisor
    });

});

module.exports = app;