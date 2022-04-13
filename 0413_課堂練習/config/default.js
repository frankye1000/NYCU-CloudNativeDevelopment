module.exports = {
  logger: {
    label: 'NCYU_EXERCISE',
  },
  mongodb: {
    connection: 'mongodb://127.0.0.1:27017/test',
  },
  nats: {
    connection: '127.0.0.1:4222',
    name: 'testbed',
    stream: 'testbed_stream',
    subject: 'testbed.subject',
    consumer: 'testbed_consumer',
  },
  jwt: {
    secret: 'jet-secret-key',
  },
  domainService: {
    workflow: {
      endpoint: 'http://127.0.0.1:3010',
      port: 3010,
      apiKey: 'bddd7ae9-2363-4c40-a0e5-9ffe722db3d3',
    },
    order: {
      endpoint: 'http://127.0.0.1:3030',
      port: 3030,
      apiKey: '5d6902fe-5126-402c-8d2f-d31f44fbf1ad',
    },
    process: {
      endpoint: 'http://127.0.0.1:3031',
      port: 3031,
      apiKey: 'a3898827-4d1e-4b6c-a52c-cdcfca32247c',
    },
    deliver: {
      endpoint: 'http://127.0.0.1:3032',
      port: 3032,
      apiKey: '05595097-149a-46f7-bc1a-3b583130288a',
    },
    gateway: {
      endpoint: 'http://127.0.0.1:3033',
      port: 3033,
      apiKey: '6af27f73-fb07-4a94-bbb5-1895e686761a',
    },
  },
};
