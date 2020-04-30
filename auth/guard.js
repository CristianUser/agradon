const verifyAuth = require('./utils').verifyAuth,
  log = require('../lib/services/log')({ file: __filename });

module.exports = (router, schemas, rootPath) => {
  const schemaList = Object.keys(schemas),
    routes = [
      { method: 'get' },
      { method: 'post' },
      { method: 'get', param: 'id' },
      { method: 'put', param: 'id' },
      { method: 'delete', param: 'id' }
    ];

  schemaList.forEach(schemaName => {
    const schemaAuthConfig = schemas[schemaName]._auth;

    if (schemaAuthConfig) {
      routes.forEach(({ method, param }) => {
        if (schemaAuthConfig[method]) {
          if (param) {
            router[method](`${rootPath}/${schemaName}/:${param}`, verifyAuth());
            log.debug(`Guard for "${method}" '${rootPath}/${schemaName}/:${param}'`);
          } else {
            router[method](`${rootPath}/${schemaName}`, verifyAuth());
            log.debug(`Guard for "${method}" '${rootPath}/${schemaName}'`);
          }
        }
      });
    }
  });
};
