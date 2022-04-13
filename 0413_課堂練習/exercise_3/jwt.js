const { domainService } = require('config');

const axios = require('axios');

const logger = require('./utilities/logger');

const workflowUrl = domainService.workflow.endpoint;

const run = async () => {
  axios
    .post(`${workflowUrl}/api/v1/jwts/generation`, {
      username: 'jhchao',
      password: 'abcd1234',
      role: 'super',
    })
    .then(({ data }) => {
      const { accessToken } = data;

      return axios.post(`${workflowUrl}/api/v1/jwts/verification`, null, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
    })
    .then(({ data }) => {
      logger.info('finish the jwt processing', data);
    })
    .catch((err) => {
      logger.error(err);
    });
};

run();
