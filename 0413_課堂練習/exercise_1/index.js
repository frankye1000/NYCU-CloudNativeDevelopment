const orderUtil = require('./utilities/order');
const processUtil = require('./utilities/process');
const deliverUtil = require('./utilities/deliver');

const logger = require('./utilities/logger');

const run = async () => {
  const orderName = process.argv[2] || 'testbed';
  const targetName = process.argv[3] || 'jhchao@tsmc.com';

  // make order
  const orderResult = await orderUtil.process(orderName);
  logger.info('order has completed', orderResult);

  // make process
  const processResult = await processUtil.process();
  logger.info('process has completed', processResult);

  // make deliver
  const deliverResult = await deliverUtil.process(targetName);
  logger.info('deliver has completed', deliverResult);
};

run();
