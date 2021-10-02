/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import { Router } from 'express';
import { Model } from 'mongoose';
import { createCrudHandlers } from './controllers';

/**
 * Returns path with param
 * @param {Object} route
 * @param {string} route.param
 * @returns {string} routePath
 */
function getPath({ param }: any) {
  return param ? `/:${param}` : '/';
}

/**
 * Create four basic routes
 * @param {Express.Application} router
 * @param {Object} controller
 * @param {Array} middlewares
 * @returns {Object} router
 */
export function createCrudRoutes(router: Router, controller: any) {
  const routes = [
    { method: 'get' },
    { method: 'get', handler: 'getById', param: 'id' },
    { method: 'post' },
    { method: 'put', param: 'id' },
    { method: 'delete', param: 'id' }
  ];

  for (const route of routes) {
    const routeHandler = _.get(controller, route.handler || route.method);

    if (routeHandler) {
      router[route.method as 'get' | 'post' | 'put' | 'delete'](getPath(route), routeHandler);
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
export function createDefaultCRUD(router: Router, model: Model<any>) {
  return createCrudRoutes(router, createCrudHandlers(model));
}
