const dbClient = require('./utilities/db');
const orderUtil = require('./utilities/order');
const processUtil = require('./utilities/process');
const deliverUtil = require('./utilities/deliver');

const logger = require('./utilities/logger');

const run = async () => {
  const orderName = process.argv[2] || 'testbed';
  const targetName = process.argv[3] || 'jhchao@tsmc.com';

  // initialize db client
  await dbClient.init();

  let res = null;

  // make order
  res = await orderUtil.process(orderName);
  const orderId = res.orderId;
  logger.info(`order is making`, res);

  // make process
  res = await processUtil.process(orderId);
  logger.info(`process is making`, res);

  // make deliver
  res = await deliverUtil.process(orderId, targetName);
  logger.info(`deliver is making`, res);

  // complete deliver
  res = await deliverUtil.complete(orderId);
  logger.info(`deliver is completed`, res);

  // complete process
  res = await processUtil.complete(orderId);
  logger.info(`process is completed`, res);

  // complete order
  res = await orderUtil.complete(orderId);
  logger.info(`order is completed`, res);

  // deinitialize db client
  await dbClient.deinit();
};

run();
