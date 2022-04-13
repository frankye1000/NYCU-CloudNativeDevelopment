const { domainService } = require('config');
const axios = require('axios');
const moment = require('moment');

const logger = require('./utilities/logger');

const orderUrl = domainService.order.endpoint;
const orderApiKey = domainService.order.apiKey;

const processUrl = domainService.process.endpoint;
const processApiKey = domainService.process.apiKey;

const deliverUrl = domainService.deliver.endpoint;
const deliverApiKey = domainService.deliver.apiKey;

const workflow = async (orderName, targetName) => {
  // make order
  const orderRes = await axios.post(
    `${orderUrl}/api/v1/orders`,
    {
      name: orderName,
    },
    {
      headers: {
        order_api_key: orderApiKey,
      },
    }
  );
  const orderId = orderRes.data.orderId;

  logger.info(`the workflow is triggered`, orderRes.data);

  // make process, deliver, and then complete all
  return {
    orderId,
    job: axios
      .post(
        `${processUrl}/api/v1/processes`,
        {
          orderId,
        },
        {
          headers: {
            process_api_key: processApiKey,
          },
        }
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
          {
            headers: {
              deliver_api_key: deliverApiKey,
            },
          }
        );
      })
      .then(({ data }) => {
        logger.info(`deliver module is processing`, data);

        // complete deliver
        return axios.patch(`${deliverUrl}/api/v1/delivers/${orderId}`, null, {
          headers: {
            deliver_api_key: deliverApiKey,
          },
        });
      })
      .then(({ data }) => {
        logger.info(`deliver module is completing`, data);

        // complete process
        return axios.patch(`${processUrl}/api/v1/processes/${orderId}`, null, {
          headers: {
            process_api_key: processApiKey,
          },
        });
      })
      .then(({ data }) => {
        logger.info(`process module is completing`, data);

        // complete order
        return axios.patch(`${orderUrl}/api/v1/orders/${orderId}`, null, {
          headers: {
            order_api_key: orderApiKey,
          },
        });
      })
      .then(({ data }) => {
        logger.info(`order module is completing`, data);
      }),
  };
};

const run = async () => {
  const orderName = process.argv[2] || 'testbed';
  const targetName = process.argv[3] || 'jhchao@tsmc.com';

  // make workflow
  workflow(orderName, targetName)
    .then(({ orderId }) => {
      // check the result with polling
      const begin = moment();

      const handler = setInterval(async () => {
        const { data } = await axios.get(`${orderUrl}/api/v1/orders/${orderId}`, {
          headers: {
            order_api_key: orderApiKey,
          },
        });

        if (data.completed) {
          logger.info(`the workflow is completed`, data);
          clearInterval(handler);
        } else {
          logger.info(`waiting for the completion...`, {
            passed: moment().diff(begin, 'seconds'),
          });
        }
      }, 1000);
    })
    .catch((err) => {
      logger.error(err);
    });
};

run();
