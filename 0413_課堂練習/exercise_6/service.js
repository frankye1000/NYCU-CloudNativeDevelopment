const { nats, domainService } = require('config');
const nodeCache = require('node-cache');

const dbClient = require('./utilities/db');
const NATSClient = require('./utilities/natsClient');

const logger = require('./utilities/logger');

const orderApp = require('./apps/order');
const processApp = require('./apps/process');
const deliverApp = require('./apps/deliver');
const workflowApp = require('./apps/workflow');
const gatewayService = require('./services/gateway');

global.cache = new nodeCache();

let natsClient = null;

const run = async () => {
  await dbClient.init();

  if (!natsClient) {
    natsClient = NATSClient.instance();
    await natsClient.connect(nats.name, [nats.connection]);

    // create the jetstream and consumer by existence
    let stream = await natsClient.getStream(nats.stream);
    if (stream) {
      await natsClient.jsm.streams.purge(nats.stream);
    } else {
      await natsClient.addStream(nats.stream, [`${nats.subject}.>`]);
    }

    await natsClient.addConsumer(
      nats.stream,
      `${nats.subject}.order.app`,
      `${nats.consumer}_order_app`
    );
    await natsClient.addConsumer(
      nats.stream,
      `${nats.subject}.order.workflow`,
      `${nats.consumer}_order_workflow`
    );
    await natsClient.addConsumer(
      nats.stream,
      `${nats.subject}.process.app`,
      `${nats.consumer}_process_app`
    );
    await natsClient.addConsumer(
      nats.stream,
      `${nats.subject}.process.workflow`,
      `${nats.consumer}_process_workflow`
    );
    await natsClient.addConsumer(
      nats.stream,
      `${nats.subject}.deliver.app`,
      `${nats.consumer}_deliver_app`
    );
    await natsClient.addConsumer(
      nats.stream,
      `${nats.subject}.deliver.workflow`,
      `${nats.consumer}_deliver_workflow`
    );
  }

  // run the order, process and deliver apps
  await orderApp.run();
  await processApp.run();
  await deliverApp.run();
  await workflowApp.run();

  // start the service of gateway
  gatewayService.listen(domainService.gateway.port, async () => {
    logger.info(`the gateway service is running`, { port: domainService.gateway.port });
  });
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
