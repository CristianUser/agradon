'use strict';

const glob = require('glob'),
  path = require('path'),
  slash = require('slash'), // has to be removed in the future
  ENTITIES_PATH = process.env.ENTITIES_PATH || 'entities';

/**
 * Try to require a filePath
 * @param {string} filePath
 * @returns {Object} module required
 */
function tryRequire(filePath) {
  try {
    require.resolve(filePath);
  } catch (ex) {
    return undefined;
  }

  return require(filePath);
}

/**
 * Returns the name of the current entity
 * @param {string} filePath
 * @returns {string}
 */
function getEntityName(filePath) {
  return slash(filePath)
    .split('/')
    .reverse()[1];
}

/**
 * Gets file paths
 * @param {string} file
 * @param {string} ext file extenxion
 * @returns {string[]} filePaths
 */
function getEntityFilePath(file, ext = '.js') {
  return glob.sync(`${ENTITIES_PATH}/**/${file}${ext}`);
}

/**
 * Put required modules in an organized object
 * @param {string[]} filePaths
 * @returns {Object} entities
 */
function requireEntityFiles(filePaths) {
  return filePaths
    .map(filePath => path.resolve(filePath))
    .reduce((prev, curr) => {
      prev[getEntityName(curr)] = tryRequire(curr);
      return prev;
    }, {});
}

/**
 * Gets the models module
 * @returns {string[]}
 */
function getModels() {
  return requireEntityFiles(getEntityFilePath('model'));
}

/**
 * Gets the schemas
 * @returns {Object}
 */
function getSchemas() {
  return getEntityFilePath('schema', '.yml').map(filePath => path.resolve(filePath));
}

/**
 * Gets the controllers module of the entities
 * @returns {Object}
 */
function getControllers() {
  return requireEntityFiles(getEntityFilePath('controller'));
}

module.exports = {
  tryRequire,
  getEntityName,
  getModels,
  getControllers,
  getSchemas
};
