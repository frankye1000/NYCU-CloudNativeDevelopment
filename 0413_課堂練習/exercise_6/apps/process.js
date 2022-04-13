const { nats } = require('config');

const NATSClient = require('../utilities/natsClient');
const processUtil = require('../utilities/process');

let natsClient = null;

const messageHandler = async (msg) => {
  const msgObj = JSON.parse(msg);

  if (msgObj.type === 'process_process_begin') {
    const { transactionId, orderId } = msgObj.content;

    // process the processing
    const { processId } = await processUtil.process(orderId);

    await natsClient.publish(`${nats.subject}.process.workflow`, {
      type: 'process_process_end',
      content: {
        transactionId,
        orderId,
        processId,
      },
    });
  } else if (msgObj.type === 'process_complete_begin') {
    const { transactionId, orderId } = msgObj.content;

    // complete the processing
    const { ok } = await processUtil.complete(orderId);

    await natsClient.publish(`${nats.subject}.process.workflow`, {
      type: 'process_complete_end',
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
    `${nats.subject}.process.app`,
    `${nats.consumer}_process_app`,
    messageHandler
  );
};

module.exports = {
  run,
};
