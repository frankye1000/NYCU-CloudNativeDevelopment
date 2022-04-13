const { domainService } = require('config');

const axios = require('axios');

const express = require('express');

const logger = require('../utilities/logger');

const router = express.Router();

const orderUrl = domainService.order.endpoint;
const orderApiKey = domainService.order.apiKey;

const processUrl = domainService.process.endpoint;
const processApiKey = domainService.process.apiKey;

const deliverUrl = domainService.deliver.endpoint;
const deliverApiKey = domainService.deliver.apiKey;

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

router.post('/api/v1/orders', async (req, res) => {
  const { data } = await axios.post(`${orderUrl}/api/v1/orders`, req.body, {
    headers: { order_api_key: orderApiKey },
  });

  return res.status(200).send(data);
});

router.patch('/api/v1/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const { data } = await axios.patch(`${orderUrl}/api/v1/orders/${orderId}`, null, {
    headers: { order_api_key: orderApiKey },
  });

  return res.status(200).send(data);
});

router.get('/api/v1/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const { data } = await axios.get(`${orderUrl}/api/v1/orders/${orderId}`, {
    headers: { order_api_key: orderApiKey },
  });

  return res.status(200).send(data);
});

router.post('/api/v1/processes', async (req, res) => {
  const { data } = await axios.post(`${processUrl}/api/v1/processes`, req.body, {
    headers: { process_api_key: processApiKey },
  });

  return res.status(200).send(data);
});

router.patch('/api/v1/processes/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const { data } = await axios.patch(`${processUrl}/api/v1/processes/${orderId}`, null, {
    headers: { process_api_key: processApiKey },
  });

  return res.status(200).send(data);
});

router.get('/api/v1/processes/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const { data } = await axios.get(`${processUrl}/api/v1/processes/${orderId}`, {
    headers: { process_api_key: processApiKey },
  });

  return res.status(200).send(data);
});

router.post('/api/v1/delivers', async (req, res) => {
  const { data } = await axios.post(`${deliverUrl}/api/v1/delivers`, req.body, {
    headers: { deliver_api_key: deliverApiKey },
  });

  return res.status(200).send(data);
});

router.patch('/api/v1/delivers/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const { data } = await axios.patch(`${deliverUrl}/api/v1/delivers/${orderId}`, null, {
    headers: { deliver_api_key: deliverApiKey },
  });

  return res.status(200).send(data);
});

router.get('/api/v1/delivers/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const { data } = await axios.get(`${deliverUrl}/api/v1/delivers/${orderId}`, {
    headers: { deliver_api_key: deliverApiKey },
  });

  return res.status(200).send(data);
});

router.post('/api/v1/workflow', checkAPIKey, async (req, res) => {
  const { orderName, targetName } = req.body;

  // make order
  const orderRes = await axios.post(
    `${orderUrl}/api/v1/orders`,
    {
      name: orderName,
    },
    { headers: { order_api_key: orderApiKey } }
  );
  const orderId = orderRes.data.orderId;

  const job = axios
    .post(
      `${processUrl}/api/v1/processes`,
      {
        orderId,
      },
      { headers: { process_api_key: processApiKey } }
    )
    .then(({ data }) => {
      logger.info(`process module is processing`, data);

      // make deliver
      return axios.post(
        `${deliverUrl}/api/v1/delivers`,
        {
          orderId,
          target: targetName,
        },
        { headers: { deliver_api_key: deliverApiKey } }
      );
    })
    .then(({ data }) => {
      logger.info(`deliver module is processing`, data);

      // complete deliver
      return axios.patch(`${deliverUrl}/api/v1/delivers/${orderId}`, null, {
        headers: { deliver_api_key: deliverApiKey },
      });
    })
    .then(({ data }) => {
      logger.info(`deliver module is completing`, data);

      // complete process
      return axios.patch(`${processUrl}/api/v1/processes/${orderId}`, null, {
        headers: { process_api_key: processApiKey },
      });
    })
    .then(({ data }) => {
      logger.info(`process module is completing`, data);

      // complete order
      return axios.patch(`${orderUrl}/api/v1/orders/${orderId}`, null, {
        headers: { order_api_key: orderApiKey },
      });
    })
    .then(({ data }) => {
      logger.info(`order module is completing`, data);
    });

  // make process, deliver, and then complete all
  return res.status(200).send({
    orderId,
    job,
  });
});

module.exports = router;
