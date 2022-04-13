const dbClient = require('./utilities/db');
const orderController = require('./controllers/order');

const logger = require('./utilities/logger');

const run = async () => {
  // initialize db client
  await dbClient.init();

  // create the order
  const resCreated = await orderController.create('test');
  logger.info(`create the order`, resCreated);

  // read the order
  const resRead = await orderController.get({ _id: resCreated.id });
  logger.info(`read the order`, resRead);

  // update the order
  const resUpdated = await orderController.update({ _id: resCreated.id }, { name: 'test2' });
  logger.info(`update the order`, resUpdated);

  // destroy the order
  const resDestroyed = await orderController.destroy({ _id: resCreated.id });
  logger.info(`destroy the order`, resDestroyed);

  // deinitialize db client
  await dbClient.deinit();
};

run();
