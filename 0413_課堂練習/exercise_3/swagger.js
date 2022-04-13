const config = require('config');

module.exports = {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Workflow API v0.0.1',
    description: 'The API for triggering workflow (order -> process -> deliver )',
    contact: {
      name: 'API Provider',
      email: 'jhchao@tsmc.com',
    },
  },
  servers: [
    {
      url: config.domainService.workflow.endpoint,
      description: 'the dev api host for exercise',
    },
  ],
  tags: [
    {
      name: 'Workflow',
      description: 'API for triggering workflow',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/api/v1/workflows': {
      post: {
        tags: ['Workflow'],
        summary: 'trigger the workflow with order name and target one',
        requestBody: {
          description: 'the request payload to trigger the workflow',
          required: true,
          content: {
            ['application/json']: {
              schema: {
                $ref: '#/components/schemas/WorkflowTriggerRequestObject',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK response',
            content: {
              ['application/json']: {
                schema: {
                  $ref: '#/components/schemas/WorkflowTriggerResponseObject',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/workflows/:orderId': {
      get: {
        tags: ['Workflow'],
        summary: 'fetch the status of the order with order id',
        parameters: [
          {
            in: 'path',
            name: 'orderId',
            description: 'the id of the order',
            schema: {
              type: 'string',
              example: '62538f9a434c081df6996a7c',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK response',
            content: {
              ['application/json']: {
                schema: {
                  $ref: '#/components/schemas/WorkflowFetchResponseObject',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      WorkflowTriggerRequestObject: {
        type: 'object',
        properties: {
          orderName: {
            type: 'string',
            example: 'test',
          },
          targetName: {
            type: 'string',
            example: 'jhchao@tsmc.com',
          },
        },
      },
      WorkflowTriggerResponseObject: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            example: '62538f9a434c081df6996a7c',
          },
        },
      },
      WorkflowFetchResponseObject: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '62538f9a434c081df6996a7c',
          },
          name: {
            type: 'string',
            example: 'test',
          },
          completed: {
            type: 'boolean',
            example: true,
          },
        },
      },
    },
  },
};
