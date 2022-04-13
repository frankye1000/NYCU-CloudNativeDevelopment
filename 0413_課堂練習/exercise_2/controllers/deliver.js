const Deliver = require('../models/deliver');

const logger = require('../utilities/logger');

const create = async (orderId, target) => {
  try {
    if (!orderId || !target) {
      throw new Error('the required parameters are not existed');
    }
    const data = await Deliver.create({
      orderId,
      target,
      completed: false,
    });

    return { id: data._id, orderId: data.orderId, target: data.target };
  } catch (err) {
    logger.error(err.message, { orderId, target });

    throw err;
  }
};

const get = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }

    const data = await Deliver.findOne(filter);

    return { id: data._id, orderId: data.orderId, target: data.target, completed: data.completed };
  } catch (err) {
    logger.error(err.message, { filter });

    throw err;
  }
};

const update = async (filter, data) => {
  try {
    if (!filter || !data) {
      throw new Error('the required parameters are not existed');
    }
    const { modifiedCount } = await Deliver.updateMany(filter, data);

    if (modifiedCount >= 1) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  } catch (err) {
    logger.error(err.message, { filter, data });

    throw err;
  }
};

const destroy = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }
    const { deletedCount } = await Deliver.deleteMany(filter);

    if (deletedCount >= 1) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  } catch (err) {
    logger.error(err.message, { filter });

    throw err;
  }
};

module.exports = {
  create,
  get,
  update,
  destroy,
};
