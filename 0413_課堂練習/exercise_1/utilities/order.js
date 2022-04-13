const fs = require('fs');
const path = require('path');

const uuidv4 = require('uuid').v4;
const moment = require('moment');

const filename = path.join(__dirname, 'orders.txt');

const process = async (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderId = uuidv4();

      const payload = { id: orderId, name, timestamp: moment().utc() };

      // update in file
      fs.writeFileSync(filename, `${JSON.stringify(payload)}\n`, {
        encoding: 'utf8',
        flag: 'a+',
      });

      // resolve the result
      resolve({
        orderId,
      });
    }, 1000);
  });
};

module.exports = {
  process,
};
