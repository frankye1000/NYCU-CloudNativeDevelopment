const { domainService } = require('config');

const express = require('express');

const deliverUtil = require('../utilities/deliver');

const router = express.Router();

const checkAPIKey = async (req, res, next) => {
  const { deliver_api_key } = req.headers;

  if (deliver_api_key && deliver_api_key === domainService.deliver.apiKey) {
    return next();
  }
  return res.status(401).send({
    ok: false,
    message: 'the api key is missing or not corrected',
  });
};

router.post('/api/v1/delivers', checkAPIKey, async (req, res) => {
  const { orderId, target } = req.body;

  const data = await deliverUtil.process(orderId, target);

  return res.status(200).send(data);
});

router.patch('/api/v1/delivers/:orderId', checkAPIKey, async (req, res) => {
  const { orderId } = req.params;

  const data = await deliverUtil.complete(orderId);

  return res.status(200).send(data);
});

router.get('/api/v1/delivers/:orderId', checkAPIKey, async (req, res) => {
  const { orderId } = req.params;

  const data = await deliverUtil.fetch(orderId);

  return res.status(200).send(data);
});

module.exports = router;
