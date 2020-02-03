'use strict';

const glob = require('glob'),
  path = require('path'),
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
 * Convert Windows backslash paths to slash paths: `foo\\bar` ➔ `foo/bar`.
 * @param {string} path - A Windows backslash path.
 * @returns {string} A path with forward slashes.
 */
function standarizePath(path) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path),
    hasNonAscii = /[^\u0000-\u0080]+/.test(path);

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, '/');
}

/**
 * Returns the name of the current entity
 * @param {string} filePath
 * @returns {string}
 */
function getEntityName(filePath) {
  return standarizePath(filePath)
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
