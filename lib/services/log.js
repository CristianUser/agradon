require('colors');

function printContext(context) {
  if (context) {
    Object.keys(context).forEach(key => {
      console.log(`      ${key}:`, context[key]);
    });
  }
}

function info(message, context) {
  console.log('INFO:'.green, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function error(message, context) {
  console.log('ERROR:'.red, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function warn(message, context) {
  console.log('WARN:'.yellow, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function debug(message, context = '') {
  console.log('DEBUG:'.blue, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function createLogger(_context) {
  return {
    info(msg, context) {
      return info(msg, Object.assign(_context, context));
    },
    error(msg, context) {
      return error(msg, Object.assign(_context, context));
    },
    warn(msg, context) {
      return warn(msg, Object.assign(_context, context));
    },
    debug(msg, context) {
      return debug(msg, Object.assign(_context, context));
    }
  };
}

module.exports = createLogger;
