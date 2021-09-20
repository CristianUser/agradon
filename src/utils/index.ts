/* eslint-disable global-require */
/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
/**
 * Try to require a filePath
 * @param {string} filePath
 * @returns {Object} module required
 */
export function tryRequire(filePath: string) {
  try {
    require.resolve(filePath);
  } catch (ex) {
    return;
  }

  return require(filePath);
}

/**
 * Convert Windows backslash paths to slash paths: `foo\\bar` ➔ `foo/bar`.
 * @param {string} path - A Windows backslash path.
 * @returns {string} A path with forward slashes.
 */
function standarizePath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

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
export function getEntityName(filePath: string) {
  return standarizePath(filePath).split('/').reverse()[1];
}

/**
 * Returns text PascalCased
 * @param {string} text
 * @returns {string}
 */
export function toPascalCase(text: string) {
  return `${text}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param {string} string
 * @returns {object}
 */
export function parseJSON(string: string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return string;
  }
}
