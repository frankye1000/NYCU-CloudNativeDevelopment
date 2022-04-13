const { domainService } = require('config');

const express = require('express');

const processUtil = require('../utilities/process');

const router = express.Router();

const checkAPIKey = async (req, res, next) => {
  const { process_api_key } = req.headers;

  if (process_api_key && process_api_key === domainService.process.apiKey) {
    return next();
  }
  return res.status(401).send({
    ok: false,
    message: 'the api key is missing or not corrected',
  });
};

router.post('/api/v1/processes', checkAPIKey, async (req, res) => {
  const { orderId } = req.body;

  const data = await processUtil.process(orderId);

  return res.status(200).send(data);
});

router.patch('/api/v1/processes/:orderId', checkAPIKey, async (req, res) => {
  const { orderId } = req.params;

  const data = await processUtil.complete(orderId);

  return res.status(200).send(data);
});

router.get('/api/v1/processes/:orderId', checkAPIKey, async (req, res) => {
  const { orderId } = req.params;

  const data = await processUtil.fetch(orderId);

  return res.status(200).send(data);
});

module.exports = router;
