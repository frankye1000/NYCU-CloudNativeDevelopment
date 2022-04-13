const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const express = require('express');

const gatewayRouter = require('../routers/gateway');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use(gatewayRouter);

module.exports = app;
