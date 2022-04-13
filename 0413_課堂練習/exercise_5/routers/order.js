const { domainService } = require('config');

const express = require('express');

const orderUtil = require('../utilities/order');

const router = express.Router();

const checkAPIKey = async (req, res, next) => {
  const { order_api_key } = req.headers;

  if (order_api_key && order_api_key === domainService.order.apiKey) {
    return next();
  }
  return res.status(401).send({
    ok: false,
    message: 'the api key is missing or not corrected',
  });
};

router.post('/api/v1/orders', checkAPIKey, async (req, res) => {
  const { name } = req.body;

  const data = await orderUtil.process(name);

  return res.status(200).send(data);
});

router.patch('/api/v1/orders/:orderId', checkAPIKey, async (req, res) => {
  const { orderId } = req.params;

  const data = await orderUtil.complete(orderId);

  return res.status(200).send(data);
});

router.get('/api/v1/orders/:orderId', checkAPIKey, async (req, res) => {
  const { orderId } = req.params;

  const data = await orderUtil.fetch(orderId);

  return res.status(200).send(data);
});

module.exports = router;
