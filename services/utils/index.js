'use strict';

const _get = require('lodash/get'),
  { createCrudHandlers } = require('../../lib/controllers');

/**
 * Create an function to remove part of string
 * @param {string} stringToRemove
 * @returns {Function}
 */
function createRemover(stringToRemove) {
  return function(string) {
    return string.replace(stringToRemove, '');
  };
}

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
 * @param {Array} midlewares
 * @returns {Object} router
 */
function createCrudRoutes(router, controller, midlewares = []) {
  const routes = [
    { method: 'get' },
    { method: 'get', handler: 'getById', param: 'id' },
    { method: 'post' },
    { method: 'put', param: 'id' },
    { method: 'post', param: 'id' },
    { method: 'delete', param: 'id' }
  ];

  for (const route of routes) {
    const routeHandler = _get(controller, route.handler || route.method);

    if (routeHandler) {
      router[route.method](getPath(route), ...midlewares, routeHandler);
    }
  }

  return router;
}

function setupDefaultCRUD(router) {
  return function(model) {
    return createDefaultCRUD(router, model);
  };
}

function createDefaultCRUD(router, model, midleware = []) {
  return createCrudRoutes(router, createCrudHandlers(model), midleware);
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
  createRemover,
  createCrudRoutes,
  setupDefaultCRUD,
  createDefaultCRUD
};
