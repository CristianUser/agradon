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
 * Gets the models file module
 * @returns {Object}
 */
function getModels() {
  return requireEntityFiles(getEntityFilePath('model'));
}

/**
 * Gets the schemas files
 * @returns {string[]} path array
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

/**
 * Returns text PascalCased
 * @param {string} text
 * @returns {string}
 */
function toPascalCase(text) {
  return `${text}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase());
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
  tryRequire,
  getEntityName,
  standarizePath,
  getModels,
  getControllers,
  getSchemas,
  toPascalCase,
  parseJSON
};
