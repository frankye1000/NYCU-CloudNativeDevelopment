const moment = require('moment');

const { create, get, update } = require('../controllers/process');

const process = async (orderId) => {
  return new Promise((resolve, reject) => {
    const begin = moment().utc();

    setTimeout(async () => {
      const end = moment().utc();

      // update in mongodb
      const data = await create(orderId, begin, end);

      // resolve the result
      resolve({ processId: data.id });
    }, 3000);
  });
};

const fetch = async (orderId) => {
  return get({ orderId });
};

const complete = async (orderId) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // update in mongodb
      const data = await update({ orderId }, { completed: true });

      // resolve the result
      resolve({ ok: data.ok });
    }, 1000);
  });
};

module.exports = {
  process,
  fetch,
  complete,
};
