const express = require('express');
//Data
const testjson = require('../test.json');
const dataBoleta = require('../dataBoleta');

const { createPdf } = require('./createpdf');
const app = express();
const plantilla1 = require('../plantilla1.json');
const plantilla2 = require('../plantilla2.json');
const fs = require('fs');
// let nombreArchivo = `testboleta-${new Date().getMilliseconds()}`;

const timbrepng = fs.readFileSync('./images/test2.png');

app.post('/create-pdf', (req, res) => {
    // let path = `${nombreArchivo}.pdf`;
    createPdf(dataBoleta, plantilla1, timbrepng);

    // res.json({
    //     ok: "ok"
    // });

    /* generar un binario con stream buffer (revisar correo para guiarse) y crear test unitario para probar el generador del pdf */

});

module.exports = app;