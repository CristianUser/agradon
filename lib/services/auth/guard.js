const verifyAuth = require('./utils').verifyAuth,
  log = require('../log')({ file: __filename });

module.exports = (router, schemas) => {
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
            router[method](`/api/${schemaName}/:${param}`, verifyAuth());
            log.debug(`Guard for "${method}" '/api/${schemaName}/:${param}'`);
          } else {
            router[method](`/api/${schemaName}`, verifyAuth());
            log.debug(`Guard for "${method}" '/api/${schemaName}'`);
          }
        }
      });
    }
  });
};
