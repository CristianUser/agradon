import { Model } from 'mongoose';

const {
  resolveArguments,
  resolveProjection,
  resolvePagination,
  applyMethods
} = require('../../query');

/**
 * Send a default response
 * @param {Promise} toResponse
 * @param {Object} response
 * @returns {Promise}
 */
export function defaultResponse(toResponse: any, response: any) {
  return toResponse
    .then((data: any) => response.json(data))
    .catch((err: any) => response.status(400).json(err));
}
/**
 * Create basic controller handlers
 * @param {Model<any>} ModelClass
 * @returns {Object} controller
 */
export function createCrudHandlers(ModelClass: Model<any>) {
  const controller: any = {};

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.post = ({ body }: any, res: any) => {
    const newDocument = new ModelClass(body);

    return defaultResponse(newDocument.save(), res);
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.get = ({ query }: any, res: any) => {
    const args = resolveArguments(query);
    const projection = resolveProjection(query);
    const options = resolvePagination(query);

    return defaultResponse(applyMethods(query, ModelClass.find(args, projection, options)), res);
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.getById = ({ params, query }: any, res: any) => {
    return defaultResponse(applyMethods(query, ModelClass.findById(params.id)), res);
  };

  /**
   * Update a model in mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.put = ({ body, params }: any, res: any) => {
    return defaultResponse(ModelClass.updateOne({ _id: params.id }, body), res);
  };

  /**
   * Delete a model from mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.delete = ({ params }: any, res: any) => {
    return defaultResponse(ModelClass.deleteOne({ _id: params.id }), res);
  };

  return controller;
}
