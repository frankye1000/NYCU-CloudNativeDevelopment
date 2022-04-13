const { create, get, update } = require('../controllers/order');

const process = async (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // update in mongodb
      const data = await create(name);

      // resolve the result
      resolve({ orderId: data.id });
    }, 1000);
  });
};

const fetch = async (orderId) => {
  return get({ orderId });
};

const complete = async (orderId) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // update in mongodb
      const data = await update({ _id: orderId }, { completed: true });

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
