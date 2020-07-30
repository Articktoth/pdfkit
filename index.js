const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const controller = require('./controller/index');
app.use('/', controller);

app.listen(port, () => {
    console.log(`server on port ${port}`)
});