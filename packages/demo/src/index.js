require('dotenv').config();
const express = require('express');
const agradon = require('@agradon/core');
const { SequelizeDB } = require('@agradon/sequelize-db');
const Sequelize = require('sequelize');
const mongoose = require('mongoose');

const { createLogger, MongooseDB } = agradon;

const log = createLogger({ file: __filename });
const app = express();

app.use(require('cors')());

async function getDb() {
  if (process.env.DB_TYPE === 'mongoose') {
    const mongooseInstance = await mongoose.connect(process.env.MONGODB_URI);

    return new MongooseDB(mongooseInstance);
  }

  const dbInstance = new Sequelize(process.env.PG_URL, {
    logging: false,
    dialectOptions: {
      useUTC: false
    },
    timezone: '-04:00'
  });

  return new SequelizeDB(dbInstance);
}

async function build() {
  const db = await getDb();

  await agradon.init({
    app,
    db,
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
