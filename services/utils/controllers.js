'use strict';

const { resolveArguments, resolveProjection, resolvePagination, applyMethods } = require('./query');

/**
 * Send a default response
 * @param {Promise} toResponse
 * @param {Object} response
 * @returns {Promise}
 */
function defaultResponse(toResponse, response) {
  return toResponse
    .then(data => response.send(data))
    .catch(err => response.sendStatus(403).send(err));
}
/**
 * Create basic controller handlers
 * @param {Object} model
 * @returns {Object} controller
 */
function createCrudHandlers(model) {
  const controller = {};

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.post = function({ body }, res) {
    const newDocument = new model(body);

    return defaultResponse(newDocument.save(), res);
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.get = function({ query }, res) {
    const args = resolveArguments(query) || {},
      projection = resolveProjection(query),
      options = resolvePagination(query);

    return defaultResponse(applyMethods(query, model.find(args, projection, options)), res);
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.getById = function({ params, query }, res) {
    return defaultResponse(applyMethods(query, model.findById(params.id)), res);
  };

  /**
   * Update a model in mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.put = function({ body, params }, res) {
    return defaultResponse(model.updateOne({ _id: params.id }, body), res);
  };

  /**
   * Delete a model from mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.delete = function({ params }, res) {
    return defaultResponse(model.deleteOne({ _id: params.id }), res);
  };

  return controller;
}

module.exports = {
  createCrudHandlers,
  defaultResponse
};
