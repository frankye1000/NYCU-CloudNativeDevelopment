const { domainService } = require('config');

const dbClient = require('./utilities/db');
const logger = require('./utilities/logger');

const app = require('./app');

app.listen(domainService.workflow.port, async () => {
  await dbClient.init();

  logger.info(`the workflow service is running`, { port: domainService.workflow.port });
});

process.on('SIGINT', async () => {
  await dbClient.deinit();

  logger.info('the workflow service is terminated');

  process.exit(1);
});
