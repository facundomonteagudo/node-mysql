const mysql = require('mysql');
const log = require('../util/logger');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'avalith_library'
});

connection.connect((error) => {
  if (error) {
    log.error(`error connecting: ${error.stack}`);
    return;
  }

  log.info(`connected as id ${connection.threadId}`);
});

module.exports = connection;
