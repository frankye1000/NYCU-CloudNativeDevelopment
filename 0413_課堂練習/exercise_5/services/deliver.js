const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const express = require('express');

const deliverRouter = require('../routers/deliver');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use(deliverRouter);

module.exports = app;
