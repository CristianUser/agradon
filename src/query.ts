import _ from 'lodash';
const { parseJSON } = require('./utils');

/**
 * Return params without unsupported characters
 * @param {string} string
 * @returns {string}
 */
export function sanitizeText(string: string) {
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
export function getQueryParam(query: any, param: string, splitBy?: string) {
  if (_.isArray(query[param])) {
    return query[param];
  }
  return _.get(query, param) ? _.get(query, param).split(splitBy) : '';
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
export function resolveMatch(query: any) {
  const matches = getQueryParam(query, 'match', ',');

  if (matches.length) {
    return matches.reduce((prev: any, curr: any) => {
      const [key, value] = curr.split(':');

      if (_.endsWith(key, '!')) {
        prev[_.dropRight(key).join('')] = { $ne: value };
      } else {
        prev[key] = value;
      }

      return prev;
    }, {});
  }

  return {};
}

export function resolvePick(query: any) {
  const toPick = getQueryParam(query, 'pick', ',');

  if (query.pick) {
    return toPick.reduce((prev: any, curr: any) => {
      prev[curr] = 1;

      return prev;
    }, {});
  }
}

export function resolveOmit(query: any) {
  const toOmit = getQueryParam(query, 'omit', ',');

  if (query.omit) {
    return toOmit.reduce((prev: any, curr: any) => {
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
export function parseOp(op: string) {
  const ops = {
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    '==': '$eq',
    '!=': '$ne'
  };

  return _.get(ops, op, op);
}

/**
 * Parse comparision values to an object
 *
 * @param {object} query
 * @returns {object}
 */
export function resolveCompare(query: any) {
  const conditionals = getQueryParam(query, 'compare') || [];

  if (conditionals.every((cond: string) => cond.split(':').length >= 3)) {
    return conditionals.reduce((prev: any, curr: string) => {
      const [key, operator] = curr.split(':');
      const value = _.drop(curr.split(':'), 2).join(':');

      _.set(prev, `${key}.${parseOp(operator)}`, parseJSON(value));

      return prev;
    }, {});
  }

  return {};
}

export function resolvePagination(query: any) {
  const limit = parseInt(_.get(query, 'perPage') || _.get(query, 'limit'));
  const page = _.get(query, 'page', 1);

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
 * @param {export function} parser this is passed to the map
 * @returns {object} object parset
 */
export function parseQueryMethod(query: any, prop: string, parser: Function) {
  const toParse = getQueryParam(query, prop);

  if (query[prop]) {
    const toReturn: any = {};

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
export function getToPopulate(query: any) {
  return parseQueryMethod(query, 'populate', (element: string) => {
    const result = sanitizeText(element.replace(/\(|\)/g, ',')).split(',');

    return { path: result[0], select: _.drop(_.compact(result)) };
  });
}

/**
 * Returns an object parsed to be used in sort method
 * @param {object} query
 * @returns {object}
 */
export function getToSort(query: any) {
  return parseQueryMethod(query, 'sort', (element: string) => {
    const [field, value] = element.split(':');
    const obj: any = {};

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
export function applyMethods(query: any, mongoQuery: any) {
  const toApply = _.merge(getToSort(query), getToPopulate(query));

  Object.keys(toApply).forEach((key) => {
    const values = toApply[key];

    values.forEach((value: any) => {
      mongoQuery[key](value);
    });
  });

  return mongoQuery;
}

export function resolveProjection(query: any) {
  return _.merge(resolveOmit(query), resolvePick(query));
}

export function resolveArguments(query: any) {
  return _.merge(resolveMatch(query), resolveCompare(query));
}
