'use strict';

const _get = require('lodash/get'),
  { createCrudHandlers } = require('./controllers');

/**
 * Returns path with param
 * @param {Object} route
 * @param {string} route.param
 * @returns {string} routePath
 */
function getPath({ param }) {
  return param ? `/:${param}` : '/';
}

/**
 * Create four basic routes
 * @param {Express.Application} router
 * @param {Object} controller
 * @param {Array} middlewares
 * @returns {Object} router
 */
function createCrudRoutes(router, controller, middlewares = []) {
  const routes = [
    { method: 'get' },
    { method: 'get', handler: 'getById', param: 'id' },
    { method: 'post' },
    { method: 'put', param: 'id' },
    { method: 'delete', param: 'id' }
  ];

  for (const route of routes) {
    const routeHandler = _get(controller, route.handler || route.method);

    if (routeHandler) {
      router[route.method](getPath(route), ...middlewares, routeHandler);
    }
  }

  return router;
}

/**
 * Creates default crud endpoints
 * @param {Object} router
 * @param {Object} model
 * @param {Function[]} middleware
 * @returns {Object} router
 */
function createDefaultCRUD(router, model, middleware) {
  return createCrudRoutes(router, createCrudHandlers(model), middleware);
}

/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param {string} string
 * @returns {object}
 */
function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return string;
  }
}

module.exports = {
  parseJSON,
  createCrudRoutes,
  createDefaultCRUD
};
