import { Model } from 'mongoose';

const { resolveArguments, resolveProjection, resolvePagination, applyMethods } = require('./query');

/**
 * Send a default response
 * @param {Promise} toResponse
 * @param {Object} response
 * @returns {Promise}
 */
export function defaultResponse(toResponse: any, response: any) {
  return toResponse
    .then((data: any) => response.send(data))
    .catch((err: any) => response.status(403).send(err));
}
/**
 * Create basic controller handlers
 * @param {Object} model
 * @returns {Object} controller
 */
export function createCrudHandlers(model: Model<any>) {
  const controller: any = {};

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.post = function({ body }: any, res: any) {
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
  controller.get = function({ query }: any, res: any) {
    const args = resolveArguments(query);
    const projection = resolveProjection(query);
    const options = resolvePagination(query);

    return defaultResponse(applyMethods(query, model.find(args, projection, options)), res);
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.getById = function({ params, query }: any, res: any) {
    return defaultResponse(applyMethods(query, model.findById(params.id)), res);
  };

  /**
   * Update a model in mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.put = function({ body, params }: any, res: any) {
    return defaultResponse(model.updateOne({ _id: params.id }, body), res);
  };

  /**
   * Delete a model from mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.delete = ({ params }: any, res: any) => {
    return defaultResponse(model.deleteOne({ _id: params.id }), res);
  };

  return controller;
}
