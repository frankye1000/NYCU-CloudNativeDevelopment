const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const express = require('express');

const orderRouter = require('../routers/order');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use(orderRouter);

module.exports = app;
