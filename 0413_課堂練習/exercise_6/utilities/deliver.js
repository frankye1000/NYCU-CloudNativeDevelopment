const { create, get, update } = require('../controllers/deliver');

const process = async (orderId, target) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // update in mongodb
      const data = await create(orderId, target);

      // resolve the result
      resolve({ deliverId: data.id });
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
