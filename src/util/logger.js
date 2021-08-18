const logger = require('pino');
const dayjs = require('dayjs');

const log = logger({
  prettyPrint: true,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format('DD/MM/YYYY - HH:mm')}"`
});

module.exports = log;
