// const { createPdf } = require('./createpdf');
// const { createPdfWide } = require('./createpdf2');
const {createBoletaType} = require('./select');
const testjson = require('../test.json');
const dataBoleta = require('../dataBoleta');
const dataBoleta2 = require('../dataBoleta2');
// const plantilla1 = require('../plantilla1.json');
// const plantilla2 = require('../plantilla2.json');

const fs = require('fs');

describe('funcion que verifica pdf', () => {
    test('Deberia bajar un archivo pdf desde una url', async () => {
        const png = fs.readFileSync('./images/test2.png');
        const pdf = await createBoletaType(dataBoleta2, png, true);

        let nombreArchivo = `testTimbre-${new Date().getMilliseconds()}`;

        await fs.writeFileSync(`${nombreArchivo}-test.pdf`, pdf);

        expect(pdf).toBeDefined();
    })
})