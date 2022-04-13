const { domainService } = require('config');
const axios = require('axios');

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
      logger.info(`the workflow is triggered`, data);
    })
    .catch((err) => {
      logger.error(err);
    });
};

run();
