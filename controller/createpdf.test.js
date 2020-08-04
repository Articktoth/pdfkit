const { createPdf } = require('./createpdf');
const testjson = require('../test.json');
const plantilla1 = require('../plantilla1.json');

const fs = require('fs');

describe('funcion que verifica pdf', () => {
    test('Deberia bajar un archivo pdf desde una url', async () => {
        const png = fs.readFileSync('./images/test2.png');
        const pdf = await createPdf(testjson, plantilla1, png);

        let nombreArchivo = `testTimbre-${new Date().getMilliseconds()}`;

        fs.writeFileSync(`${nombreArchivo}.pdf`, pdf);

        expect(pdf).toBeDefined();
    })
})