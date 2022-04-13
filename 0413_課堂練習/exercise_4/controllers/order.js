const Order = require('../models/order');

const logger = require('../utilities/logger');

const create = async (name) => {
  try {
    if (!name) {
      throw new Error('the required parameters are not existed');
    }

    const data = await Order.create({
      name,
      completed: false,
    });

    return { id: data._id, name: data.name };
  } catch (err) {
    logger.error(err.message, { name });

    throw err;
  }
};

const get = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }

    const data = await Order.findOne(filter);

    return { id: data._id, name: data.name, completed: data.completed };
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

    const { modifiedCount } = await Order.updateMany(filter, data);

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
    const { deletedCount } = await Order.deleteMany(filter);

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
