const { nats } = require('config');

const NATSClient = require('../utilities/natsClient');

const logger = require('../utilities/logger');

let natsClient = null;

const orderMessageHandler = async (msg) => {
  const msgObj = JSON.parse(msg);

  if (msgObj.type === 'order_process_end') {
    const { transactionId, orderId } = msgObj.content;

    // finish the order processing, do the process processing
    logger.info(`finish [order_process_end]`, msgObj.content);

    await natsClient.publish(`${nats.subject}.process.app`, {
      type: 'process_process_begin',
      content: {
        transactionId,
        orderId,
      },
    });
  } else if (msgObj.type === 'order_complete_end') {
    const { transactionId, orderId, ok } = msgObj.content;

    // finish the process completing, do the order completing
    logger.info(`fiinish [order_complete_end]`, msgObj.content);

    // complete or fail the workflow by returned result
    if (ok) {
      logger.info(`finish the workflow`, { transactionId, orderId });
    } else {
      logger.error(`fail the workflow`, { transactionId, orderId });
    }
  }
};

const processMessageHndler = async (msg) => {
  const msgObj = JSON.parse(msg);

  if (msgObj.type === 'process_process_end') {
    const { transactionId, orderId, processId } = msgObj.content;

    // finish the process processing, do the deliver processing
    logger.info(`finish [process_process_end]`, msgObj.content);

    const { targetName } = global.cache.get(transactionId);

    await natsClient.publish(`${nats.subject}.deliver.app`, {
      type: 'deliver_process_begin',
      content: {
        transactionId,
        orderId,
        targetName,
      },
    });
  } else if (msgObj.type === 'process_complete_end') {
    const { transactionId, orderId, ok } = msgObj.content;

    // finish the process completing, do the order completing
    logger.info(`fiinish [process_complete_end]`, msgObj.content);

    if (ok) {
      await natsClient.publish(`${nats.subject}.order.app`, {
        type: 'order_complete_begin',
        content: {
          transactionId,
          orderId,
        },
      });
    }
  }
};

const deliverMessageHandler = async (msg) => {
  const msgObj = JSON.parse(msg);

  if (msgObj.type === 'deliver_process_end') {
    const { transactionId, orderId, deliverId } = msgObj.content;

    // finish the deliver processing, fo the deliver completing
    logger.info(`finish [deliver_process_end]`, msgObj.content);

    await natsClient.publish(`${nats.subject}.deliver.app`, {
      type: 'deliver_complete_begin',
      content: {
        transactionId,
        orderId,
      },
    });
  } else if (msgObj.type === 'deliver_complete_end') {
    const { transactionId, orderId, ok } = msgObj.content;

    // finish the deliver completing, do the process completing
    logger.info(`finish [deliver_complete_end]`, msgObj.content);

    if (ok) {
      await natsClient.publish(`${nats.subject}.process.app`, {
        type: 'process_complete_begin',
        content: {
          transactionId,
          orderId,
        },
      });
    }
  }
};

const run = async () => {
  if (!natsClient) {
    natsClient = NATSClient.instance();
    await natsClient.connect(nats.name, [nats.connection]);
  }

  await natsClient.subscribe(
    nats.stream,
    `${nats.subject}.order.workflow`,
    `${nats.consumer}_order_workflow`,
    orderMessageHandler
  );

  await natsClient.subscribe(
    nats.stream,
    `${nats.subject}.process.workflow`,
    `${nats.consumer}_process_workflow`,
    processMessageHndler
  );

  await natsClient.subscribe(
    nats.stream,
    `${nats.subject}.deliver.workflow`,
    `${nats.consumer}_deliver_workflow`,
    deliverMessageHandler
  );
};

module.exports = {
  run,
};
