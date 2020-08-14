
const {createBoletaType} = require('./select');
const testjson = require('../test.json');
const dataBoleta = require('../dataBoleta');
const dataBoleta2 = require('../dataBoleta2');


const fs = require('fs');

describe('funcion que verifica pdf', () => {
    test('Deberia bajar un archivo pdf desde una url', async () => {
        const png = fs.readFileSync('./images/test2.png');
        const pdf = await createBoletaType(dataBoleta, png, 'b3');

        let nombreArchivo = `testTimbre-${new Date().getMilliseconds()}`;

        fs.writeFileSync(`${nombreArchivo}-test.pdf`, pdf);

        expect(pdf).toBeDefined();
    })
})