const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const express = require('express');

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const workflowRouter = require('./routers/workflow');
const jwtRouter = require('./routers/jwt');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1/documents/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(workflowRouter);
app.use(jwtRouter);

module.exports = app;
