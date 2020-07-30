const express = require('express');
const testjson = require('../test.json');
const { createPdf } = require('./createpdf');
const app = express();
const plantilla1 = require('../plantilla1.json');
const plantilla2 = require('../plantilla2.json');

app.post('/create-pdf', (req, res) => {
    let path = './plantilla1.pdf';

    const body = {
        razonSocial: req.body.razonSocial,
        rut: req.body.rut,
        giroEmisor: req.body.giroEmisor
    }

    if (req.body.plantilla === '1') {
        createPdf(testjson, path, body, plantilla1);
    } else if (req.body.plantilla === '2') {
        createPdf(testjson, path, body, plantilla2);
    }


    res.json({
        body
    });

});

module.exports = app;