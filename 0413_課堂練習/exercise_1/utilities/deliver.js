const fs = require('fs');
const path = require('path');

const uuidv4 = require('uuid').v4;
const moment = require('moment');

const filename = path.join(__dirname, 'delivers.txt');

const process = async (orderId, target) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deliverId = uuidv4();

      const payload = { id: deliverId, orderId, target, timestamp: moment().utc() };

      // update in file
      fs.writeFileSync(filename, `${JSON.stringify(payload)}\n`, {
        encoding: 'utf8',
        flag: 'a+',
      });

      // resolve the result
      resolve({
        deliverId,
      });
    }, 1000);
  });
};

module.exports = {
  process,
};
