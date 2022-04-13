const Process = require('../models/process');

const logger = require('../utilities/logger');

const create = async (orderId, begin, end = null) => {
  try {
    if (!orderId || !begin) {
      throw new Error('the required parameters are not existed');
    }

    let period = 0;
    if (end) {
      period = end.diff(begin, 'seconds');
    } else {
      end = begin;
      period = 0;
    }

    const data = await Process.create({
      orderId,
      begin,
      end,
      period,
      completed: false,
    });

    return { id: data._id, begin: data.begin };
  } catch (err) {
    logger.error(err.message, { orderId, begin, end });

    throw err;
  }
};

const get = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }

    const data = await Process.findOne(filter);

    return {
      id: data._id,
      begin: data.begin,
      end: data.end,
      period: data.period,
      completed: data.completed,
    };
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
    const { modifiedCount } = await Process.updateMany(filter, data);

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
    const { deletedCount } = await Process.deleteMany(filter);

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
