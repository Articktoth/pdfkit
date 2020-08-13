const { createPdf } = require('./createpdf');
const { createPdfWide } = require('./createpdf2');

const plantilla1 = require('../plantilla1.json');
const plantilla2 = require('../plantilla2.json');

const createBoletaType = (dataBoleta, timbrepng, type) => {
    if (type === true) {
        return createPdf(dataBoleta, plantilla1, timbrepng);
    }
    if (type === false) {
        return createPdfWide(dataBoleta, plantilla2, timbrepng);
    }

    return console.log("tipo de boleta no disponible")
}

module.exports = {
    createBoletaType
}