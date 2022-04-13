const { domainService } = require('config');

const axios = require('axios');
const moment = require('moment');

const logger = require('./utilities/logger');

const workflowUrl = domainService.workflow.endpoint;

const run = async () => {
  try {
    const orderName = process.argv[2] || 'testbed';
    const targetName = process.argv[3] || 'jhchao@tsmc.com';

    // make workflow
    const { data } = await axios.post(
      `${workflowUrl}/api/v1/workflows`,
      {
        name: orderName,
        target: targetName,
      },
      {
        headers: {
          workflow_api_key: domainService.workflow.apiKey,
        },
      }
    );
    const orderId = data.orderId;

    logger.info(`the workflow is triggered`, data);

    // check the result with polling
    const begin = moment();

    const handler = setInterval(async () => {
      const { data } = await axios.get(`${workflowUrl}/api/v1/workflows/${orderId}`, {
        headers: {
          workflow_api_key: domainService.workflow.apiKey,
        },
      });

      if (data.completed) {
        logger.info(`the workflow is completed`, data);
        clearInterval(handler);
      } else {
        logger.info(`waiting for the completion...`, { passed: moment().diff(begin, 'seconds') });
      }
    }, 1000);
  } catch (err) {
    logger.error(err.message);
  }
};

run();
