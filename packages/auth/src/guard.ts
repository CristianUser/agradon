import { Router } from 'express';
import { FileGroup } from '@agradon/core';
import { verifyAuth } from './utils';

/**
 * Set auth middleware to protect endpoints
 *
 * @param {object} router
 * @param {object} schemas
 * @param {string} rootPath
 */
export default (router: Router, schemas: FileGroup<any>, rootPath = '') => {
  const schemaList = Object.keys(schemas);
  const routes = [
    { method: 'get' },
    { method: 'post' },
    { method: 'get', param: 'id' },
    { method: 'put', param: 'id' },
    { method: 'delete', param: 'id' }
  ];

  schemaList.forEach((schemaName) => {
    // eslint-disable-next-line no-underscore-dangle
    const schemaAuthConfig = schemas[schemaName]._auth;

    if (schemaAuthConfig) {
      routes.forEach(({ method, param }) => {
        if (schemaAuthConfig[method]) {
          const routeStr = param
            ? `${rootPath}/${schemaName}/:${param}`
            : `${rootPath}/${schemaName}`;

          router[method as 'get'](routeStr, verifyAuth());
        }
      });
    }
  });
};
