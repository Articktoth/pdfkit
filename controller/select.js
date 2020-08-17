const { createPdf } = require('./createpdf');
const { createPdfWide } = require('./createpdf2');
const { createPdfSinDetalle } = require('./createpdf3');
const { createPdfTamañoCarta } = require('./createpdf4');

const plantilla1 = require('../plantilla1.json');
const plantilla2 = require('../plantilla2.json');
const plantilla3 = require('../plantilla3.json');

const createBoletaType = (dataBoleta, timbrepng, type) => {
    //Boleta angosta 80mm
    if (type === 'b1') {
        return createPdf(dataBoleta, plantilla1, timbrepng);
    }
    //Boleta ancha 120mm
    if (type === 'b2') {
        return createPdfWide(dataBoleta, plantilla2, timbrepng);
    }
    //Boleta sin detalle 80mm
    if (type === 'b3') {
        return createPdfSinDetalle(dataBoleta, plantilla1, timbrepng);
    }
    //Boleta tamaño Carta 
    if(type === 'b4'){
        return createPdfTamañoCarta(dataBoleta, plantilla3, timbrepng)
    }
    return console.log("tipo de boleta no disponible")
}

module.exports = {
    createBoletaType
}