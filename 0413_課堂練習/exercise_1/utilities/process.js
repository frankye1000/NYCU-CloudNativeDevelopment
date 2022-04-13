const fs = require('fs');
const path = require('path');

const uuidv4 = require('uuid').v4;
const moment = require('moment');

const filename = path.join(__dirname, 'processes.txt');

const process = async (orderId) => {
  return new Promise((resolve, reject) => {
    const begin = moment().utc();

    setTimeout(() => {
      const end = moment().utc();
      const period = end.diff(begin, 'seconds');

      const processId = uuidv4();

      const payload = {
        id: processId,
        orderId,
        begin,
        end,
        period,
        timestamp: moment().utc(),
      };

      // update in file
      fs.writeFileSync(filename, `${JSON.stringify(payload)}\n`, {
        encoding: 'utf8',
        flag: 'a+',
      });

      // resolve the result
      resolve({
        processId,
      });
    }, 3000);
  });
};

module.exports = {
  process,
};
