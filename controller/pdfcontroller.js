const express = require('express');
const app = express();

const testjson = require('../test.json');
const {createPdf} = require('./createpdf');

app.post('/create-pdf', (req, res) => {
    const body = {
        razonSocial: req.body.razonSocial,
        rut: req.body.rut,
        giroEmisor: req.body.giroEmisor
    }
    // const razonSocial = req.body.razonSocial;
    // const rut = req.body.rut;
    // const giroEmisor = req.body.giroEmisor;
    // const options = req.body.options;
    // const details = req.body.details;
    // console.log(details

    let path = './probando.pdf';
    createPdf(testjson, path, body);

    // const doc = new PDFDocument(
    //     {
    //         size: [226, 340],
    //         margins: {
    //             top: 20,
    //             bottom: 20,
    //             left: 10,
    //             right: 10
    //         }
    //     }
    // );

    // const idDoc = testjson.Documento.Encabezado.IdDoc;
    // const items = testjson.Documento.Detalle;

    // doc.pipe(fs.createWriteStream(`./tests/condetalles.pdf`));

    // doc
    //     .fontSize(10)
    //     .text(`${razonSocial}`, { align: `${options.option1}` })
    //     .text(`${rut}`, { align: `${options.option2}` })
    //     .text(`${giroEmisor}`, { align: `${options.option3}` })
    //     .text(`FECHA EMISION: ${idDoc.FchEmis}`, { align: "left" });

    // //DEtalles
    // if (details == true) {
    //     for (i = 0; i < items.length; i++) {
    //         const item = items[i];
    //         const position = 100 + (i + 1) * 10;
    //         doc
    //             .text(item.NmbItem, 10, position)
    //             .text(item.PrcItem, 10, position, { align: 'right' });
    //     }
    // } else if (details == false) {
    //     doc.moveDown();
    // }

    // doc.moveDown();

    // doc
    //     .text('DEBITO', 10, 200)
    //     .text('precio', 10, 200, { align: 'right' })
    //     .text('TOTAL', 10, 210,)
    //     .text('PRECIO', 10, 210, { align: 'right' });

    // doc.image('images/test.png', {
    //     fit: [200, 150],
    //     align: 'left'
    // });

    // doc.end();

    res.json({
        body
    });

});

module.exports = app;