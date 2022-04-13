const { nats, domainService } = require('config');

const dbClient = require('./utilities/db');
const NATSClient = require('./utilities/natsClient');
const logger = require('./utilities/logger');

let natsClient = null;

const run = async () => {
  await dbClient.init();

  if (!natsClient) {
    natsClient = NATSClient.instance();
    await natsClient.connect(nats.name, [nats.connection]);
  }
};

process.on('SIGINT', async () => {
  if (natsClient) {
    await natsClient.disconnect();

    natsClient = null;
  }

  await dbClient.deinit();

  logger.info('the whole service is terminated');

  process.exit(1);
});

run();
