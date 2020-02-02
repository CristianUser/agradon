'use strict';

const _get = require('lodash/get'),
  _set = require('lodash/set'),
  _merge = require('lodash/merge'),
  _endsWith = require('lodash/endsWith'),
  _dropRight = require('lodash/dropRight'),
  _drop = require('lodash/drop');

function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return string;
  }
}

/**
 * Return params without unsupported characters
 * @param {string} string
 * @returns {string}
 */
function sanitizeText(string) {
  return string.replace(' ', '');
}

/**
 * Extract query param
 *
 * @param {object} query
 * @param {string} param
 * @param {string} splitBy
 * @returns {Array}
 */
function getQueryParam(query, param, splitBy) {
  return Array.isArray(query[param]) ? query[param] : _get(query, param, '').split(splitBy);
}

/**
 * Parse match string as Object
 *
 * @param {Object} query
 * @returns {Object} matchObject
 *
 * @example
 * let match = 'name:cmj,age:18';
 * resolveMatch(match) // { name: 'cmj', 'age': 8 }
 */
function resolveMatch(query) {
  const matches = getQueryParam(query, 'match', ',');

  if (matches) {
    return matches.reduce((prev, curr) => {
      const [key, value] = curr.split(':');

      if (_endsWith(key, '!')) {
        prev[_dropRight(key).join('')] = { $ne: value };
      } else {
        prev[key] = value;
      }

      return prev;
    }, {});
  }
}

function resolvePick(query) {
  const toPick = getQueryParam(query, 'pick', ',');

  if (query.pick) {
    return toPick.reduce((prev, curr) => {
      prev[curr] = 1;

      return prev;
    }, {});
  }
}

function resolveOmit(query) {
  const toOmit = getQueryParam(query, 'omit', ',');

  if (query.omit) {
    return toOmit.reduce((prev, curr) => {
      prev[curr] = 0;
      return prev;
    }, {});
  }
}

/**
 * Parse JS operator to Mongo operator
 *
 * @param {string} op
 * @returns {string} mongo op
 */
function parseOp(op) {
  const ops = {
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    '=': '$eq',
    '!=': '$ne'
  };

  return _get(ops, op, op);
}

/**
 * Parse comparision values to an object
 *
 * @param {object} query
 * @returns {object}
 */
function resolveCompare(query) {
  const conditionals = getQueryParam(query, 'compare');

  if (conditionals.every(cond => cond.split(':').length >= 3)) {
    return conditionals.reduce((prev, curr) => {
      const [key, operator] = curr.split(':'),
        value = _drop(curr.split(':'), 2).join(':');

      _set(prev, `${key}.${parseOp(operator)}`, parseJSON(value));

      return prev;
    }, {});
  }
}

function resolvePagination(query) {
  const limit = parseInt(_get(query, 'perPage') || _get(query, 'limit')),
    page = _get(query, 'page', 1);

  if (limit) {
    return {
      skip: limit * (page - 1),
      limit
    };
  }
}

/**
 * Creates an object structure to be applied to an mongoose method
 *
 * @param {object} query
 * @param {string} prop method and query property name
 * @param {function} parser this is passed to the map
 * @returns {object} object parset
 */
function parseQueryMethod(query, prop, parser) {
  const toParse = getQueryParam(query, prop);

  if (query[prop]) {
    const toReturn = {};

    toReturn[prop] = toParse.map(parser);
    return toReturn;
  }
}

/**
 * Returns an object parsed to be used in populate method
 *
 * @param {object} query
 * @returns {object}
 */
function getToPopulate(query) {
  return parseQueryMethod(query, 'populate', element => {
    const result = sanitizeText(element.replace(/\(|\)/g, ',')).split(',');

    return { path: result[0], select: _dropRight(result) };
  });
}

/**
 * Returns an object parsed to be used in sort method
 * @param {object} query
 * @returns {object}
 */
function getToSort(query) {
  return parseQueryMethod(query, 'sort', element => {
    const [field, value] = element.split(':'),
      obj = {};

    obj[field] = value;
    return obj;
  });
}

/**
 * Executes parsed methods passed in the query
 * @param {object} query
 * @param {object} mongoQuery
 * @returns {object} mongoQuery
 */
function applyMethods(query, mongoQuery) {
  const toApply = _merge(getToSort(query), getToPopulate(query));

  for (const key in toApply) {
    if (toApply.hasOwnProperty(key)) {
      const values = toApply[key];

      values.forEach(value => {
        mongoQuery[key](value);
      });
    }
  }
  return mongoQuery;
}

function resolveProjection(query) {
  return _merge(resolveOmit(query), resolvePick(query));
}

function resolveArguments(query) {
  return _merge(resolveMatch(query), resolveCompare(query));
}

module.exports = {
  applyMethods,
  resolveProjection,
  resolvePagination,
  resolveArguments
};
