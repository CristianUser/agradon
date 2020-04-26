'use strict';

const mongoose = require('mongoose'),
  log = require('./log')({ file: __filename });

module.exports = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      log.info('MongoDB connection succeeded.');
    })
    .catch(err => {
      log.error(`Error in MongoDB connection : ${JSON.stringify(err, undefined, 2)}`);
    });

  return mongoose;
};
