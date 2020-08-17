
const {createBoletaType} = require('./select');

//DATA
const testjson = require('../test.json');
const dataBoleta = require('../dataBoleta');
const dataBoleta2 = require('../dataBoleta2');
// const dataBoletaCarta = require('../dataBoleta3.json');


const fs = require('fs');

describe('funcion que verifica pdf', () => {
    test('Deberia bajar un archivo pdf desde una url', async () => {
        const png = fs.readFileSync('./images/test2.png');
        const pdf = await createBoletaType(dataBoletaCarta, png, 'b1');

        let nombreArchivo = `testTimbre-${new Date().getMilliseconds()}`;

        fs.writeFileSync(`${nombreArchivo}-test.pdf`, pdf);

        expect(pdf).toBeDefined();
    })
})