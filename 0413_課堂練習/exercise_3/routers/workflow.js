const { domainService } = require('config');

const express = require('express');

const orderUtil = require('../utilities/order');
const processUtil = require('../utilities/process');
const deliverUtil = require('../utilities/deliver');

const logger = require('../utilities/logger');

const checkAPIKey = async (req, res, next) => {
  const { workflow_api_key } = req.headers;

  if (workflow_api_key && workflow_api_key === domainService.workflow.apiKey) {
    return next();
  }
  return res.status(401).send({
    ok: false,
    message: 'the api key is missing or not corrected',
  });
};

const router = express.Router();

router.post('/api/v1/workflows', checkAPIKey, async (req, res) => {
  const { name, target } = req.body;

  // make order
  const { orderId } = await orderUtil.process(name);

  // make process and deliver, then complete all
  processUtil
    .process(orderId)
    .then((data) => {
      logger.info(`process module is processing`, data);

      // make deliver
      return deliverUtil.process(orderId, target);
    })
    .then((data) => {
      logger.info(`deliver module is processing`, data);

      // complete deliver
      return deliverUtil.complete(orderId);
    })
    .then((data) => {
      logger.info(`deliver module is completing`, data);

      // complete process
      return processUtil.complete(orderId);
    })
    .then((data) => {
      logger.info(`process module is completing`, data);

      // complete order
      return orderUtil.complete(orderId);
    })
    .then((data) => {
      logger.info(`order module is completing`, data);
    });

  return res.status(200).send({
    orderId,
  });
});

router.get('/api/v1/workflows/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const data = await orderUtil.fetch(orderId);

  return res.status(200).send(data);
});

module.exports = router;
