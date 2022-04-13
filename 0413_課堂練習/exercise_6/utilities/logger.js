const { createLogger, format, transports } = require('winston');
const { timestamp, printf, combine, splat, label } = format;

const config = require('config');

const customFormat = printf(({ timestamp, label, message, level, ...metadata }) => {
  return `[${label}] | ${timestamp} | ${level} | ${message} | ${JSON.stringify(metadata)}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    label({
      label: config.logger.label,
      message: false,
    }),
    splat(),
    customFormat
  ),
  transports: [new transports.Console({ level: 'debug' })],
});

module.exports = logger;
