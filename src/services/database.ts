import mongoose from 'mongoose';
import { createLogger } from './log'

const log = createLogger({ file: __filename });

export default () => {
  return mongoose
    .connect(process.env.MONGODB_URI || '')
    .then(() => {
      log.info('MongoDB connection succeeded.');
    })
    .catch((err) => {
      log.error(`Error in MongoDB connection : ${JSON.stringify(err, undefined, 2)}`);
    });
};
