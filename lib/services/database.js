'use strict';

require('colors');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connection succeeded.'.green);
  })
  .catch(err => {
    console.log('Error in MongoDB connection : '.red + JSON.stringify(err, undefined, 2).red);
  });
