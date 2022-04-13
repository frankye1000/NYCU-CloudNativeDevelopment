const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const express = require('express');

const processRouter = require('../routers/process');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use(processRouter);

module.exports = app;
