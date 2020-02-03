'use strict';

const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('MongoDB connection succeeded.');
    })
    .catch(err => {
      console.log(`Error in MongoDB connection : ${JSON.stringify(err, undefined, 2).red}`);
    });
};
