const { domainService, nats } = require('config');

const uuidv4 = require('uuid').v4;

const express = require('express');

const NATSClient = require('../utilities/natsClient');

const router = express.Router();

let natsClient = null;

const checkAPIKey = async (req, res, next) => {
  const { gateway_api_key } = req.headers;

  if (gateway_api_key && gateway_api_key === domainService.gateway.apiKey) {
    return next();
  }
  return res.status(401).send({
    ok: false,
    message: 'the api key is missing or not corrected',
  });
};

router.post('/api/v1/workflow', checkAPIKey, async (req, res) => {
  const { orderName, targetName } = req.body;

  if (!natsClient) {
    natsClient = NATSClient.instance();
    await natsClient.connect(nats.name, [nats.connection]);
  }

  // make the transactionId and store the data in the storage
  const transactionId = uuidv4();

  global.cache.set(transactionId, {
    orderName,
    targetName,
  });

  natsClient.publish(`${nats.subject}.order.app`, {
    type: 'order_process_begin',
    content: {
      transactionId,
      orderName,
    },
  });

  // response the orderId to the client
  return res.status(200).send({
    ok: true,
    transactionId,
  });
});

module.exports = router;
