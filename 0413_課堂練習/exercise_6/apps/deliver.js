const { nats } = require('config');

const NATSClient = require('../utilities/natsClient');
const deliverUtil = require('../utilities/deliver');

let natsClient = null;

const messageHandler = async (msg) => {
  const msgObj = JSON.parse(msg);

  if (msgObj.type === 'deliver_process_begin') {
    const { transactionId, orderId, targetName } = msgObj.content;

    // process the delievering
    const { deliverId } = await deliverUtil.process(orderId, targetName);

    await natsClient.publish(`${nats.subject}.deliver.workflow`, {
      type: 'deliver_process_end',
      content: {
        transactionId,
        orderId,
        deliverId,
      },
    });
  } else if (msgObj.type === 'deliver_complete_begin') {
    const { transactionId, orderId } = msgObj.content;

    // compete the delivering
    const { ok } = await deliverUtil.complete(orderId);

    await natsClient.publish(`${nats.subject}.deliver.workflow`, {
      type: 'deliver_complete_end',
      content: {
        transactionId,
        orderId,
        ok,
      },
    });
  }
};

const run = async () => {
  if (!natsClient) {
    natsClient = NATSClient.instance();
    await natsClient.connect(nats.name, [nats.connection]);
  }

  await natsClient.subscribe(
    nats.stream,
    `${nats.subject}.deliver.app`,
    `${nats.consumer}_deliver_app`,
    messageHandler
  );
};

module.exports = {
  run,
};
