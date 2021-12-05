require('dotenv').config();
const express = require('express');
const agradon = require('@agradon/core');
const { SequelizeDB } = require('@agradon/sequelize-db');
const Sequelize = require('sequelize');

const { createLogger } = agradon;

const log = createLogger({ file: __filename });
const app = express();

app.use(require('cors')());

async function build() {
  const dbInstance = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    dialectOptions: {
      useUTC: false
    },
    timezone: '-04:00'
  });

  await agradon.init({
    app,
    db: new SequelizeDB(dbInstance),
    rootPath: '/api'
  });

  app.use('**', (req, res) => {
    res.status(404).send('Not Found');
  });

  app.listen(process.env.PORT, () =>
    log.info(`Server is listening on port ${process.env.PORT}`, {
      port: Number(process.env.PORT),
      pid: process.pid,
      node_version: process.version
    })
  );

  return app;
}

module.exports = build();
