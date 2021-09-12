require('colors');

function printContext(context: any) {
  if (context) {
    Object.keys(context).forEach((key) => {
      console.log(`      ${key}:`, context[key]);
    });
  }
}

function info(message: string, context: any) {
  console.log(('INFO:' as any).green, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function error(message: string, context: any) {
  console.log(('ERROR:' as any).red, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function warn(message: string, context: any) {
  console.log(('WARN:' as any).yellow, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

function debug(message: string, context: any = {}) {
  console.log(('DEBUG:' as any).blue, `[${new Date().toISOString()}]`, message);
  printContext(context);
}

export function createLogger(_context: any) {
  return {
    info(msg: string, context?: any) {
      return info(msg, Object.assign(_context, context));
    },
    error(msg: string, context?: any) {
      return error(msg, Object.assign(_context, context));
    },
    warn(msg: string, context?: any) {
      return warn(msg, Object.assign(_context, context));
    },
    debug(msg: string, context?: any) {
      return debug(msg, Object.assign(_context, context));
    }
  };
}

export default createLogger;
