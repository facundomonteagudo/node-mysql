const express = require('express');
const routes = require('./routes/routes');
const log = require('./util/logger');

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
  log.info(`server listening at http://localhost:${port}`);
});
