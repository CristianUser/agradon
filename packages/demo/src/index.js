require('dotenv').config();
const { AuthPlugin } = require('@agradon/auth');
const { createLogger } = require('@agradon/core');
const { MongooseDB } = require('@agradon/mongoose-db');
const { SequelizeDB } = require('@agradon/sequelize-db');
const agradon = require('@agradon/core');
const express = require('express');
const mongoose = require('mongoose');
const Sequelize = require('sequelize');

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
    plugins: [new AuthPlugin()],
    rootPath: '/api'
  });

  app.use('**', (req, res) => {
    res.status(404).send('Not Found');
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    log.error(err.message);
    res.status(500).send({
      message: 'Internal Server Error',
      error: err
    });
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
