const { domainService } = require('config');
const axios = require('axios');
const moment = require('moment');

const logger = require('./utilities/logger');

const gatewayUrl = domainService.gateway.endpoint;
const gatewayApiKey = domainService.gateway.apiKey;

const run = async () => {
  const orderName = process.argv[2] || 'testbed';
  const targetName = process.argv[3] || 'jhchao@tsmc.com';

  // make workflow
  axios
    .post(
      `${gatewayUrl}/api/v1/workflow`,
      { orderName, targetName },
      {
        headers: {
          gateway_api_key: gatewayApiKey,
        },
      }
    )
    .then(({ data }) => {
      const orderId = data.orderId;

      logger.info(`the workflow is triggered`, data);

      // check the result with polling
      const begin = moment();

      const handler = setInterval(async () => {
        const orderRes = await axios.get(`${gatewayUrl}/api/v1/orders/${orderId}`, {
          headers: {
            gateway_api_key: gatewayApiKey,
          },
        });

        if (orderRes.data.completed) {
          logger.info(`the workflow is completed`, orderRes.data);
          clearInterval(handler);
        } else {
          logger.info(`waiting for the completion...`, { passed: moment().diff(begin, 'seconds') });
        }
      }, 1000);
    })
    .catch((err) => {
      logger.error(err);
    });
};

run();
