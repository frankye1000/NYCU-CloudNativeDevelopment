const { domainService } = require('config');

const dbClient = require('./utilities/db');
const logger = require('./utilities/logger');

const orderApp = require('./services/order');
const processApp = require('./services/process');
const deliverApp = require('./services/deliver');
const gatewayApp = require('./services/gateway');

const run = async () => {
  await dbClient.init();

  orderApp.listen(domainService.order.port, async () => {
    logger.info(`the order service is running`, { port: domainService.order.port });
  });

  processApp.listen(domainService.process.port, async () => {
    logger.info(`the process service is running`, { port: domainService.process.port });
  });

  deliverApp.listen(domainService.deliver.port, async () => {
    logger.info(`the deliver service is running`, { port: domainService.deliver.port });
  });

  gatewayApp.listen(domainService.gateway.port, async () => {
    logger.info(`the gateway service is running`, { port: domainService.gateway.port });
  });
};

process.on('SIGINT', async () => {
  await dbClient.deinit();

  logger.info('the whole service is terminated');

  process.exit(1);
});

run();
