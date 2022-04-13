const { nats } = require('config');

const NATSClient = require('../utilities/natsClient');
const orderUtil = require('../utilities/order');

let natsClient = null;

const messageHandler = async (msg) => {
  const msgObj = JSON.parse(msg);

  if (msgObj.type === 'order_process_begin') {
    const { transactionId, orderName } = msgObj.content;

    // process the ordering
    const { orderId } = await orderUtil.process(orderName);

    await natsClient.publish(`${nats.subject}.order.workflow`, {
      type: 'order_process_end',
      content: {
        transactionId,
        orderId,
      },
    });
  } else if (msgObj.type === 'order_complete_begin') {
    const { transactionId, orderId } = msgObj.content;

    // complete the ordering
    const { ok } = await orderUtil.complete(orderId);

    await natsClient.publish(`${nats.subject}.order.workflow`, {
      type: 'order_complete_end',
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
    `${nats.subject}.order.app`,
    `${nats.consumer}_order_app`,
    messageHandler
  );
};

module.exports = {
  run,
};
