import { Model, ModelCtor } from 'sequelize';

import { resolveArguments, resolvePagination, applyMethods } from '../../query';

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
export function createCrudHandlers(ModelClass: ModelCtor<Model<any>>) {
  const controller: any = {};

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.post = async ({ body }: any, res: any) => {
    const newDocument = await ModelClass.create(body);

    return defaultResponse((await newDocument.save()).toJSON(), res);
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
    const { limit, skip } = resolvePagination(query) || {};

    return defaultResponse(
      applyMethods(query, ModelClass.findAll({ where: args, offset: skip, limit })),
      res
    );
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.getById = ({ params, query }: any, res: any) => {
    return defaultResponse(applyMethods(query, ModelClass.findByPk(params.id)), res);
  };

  /**
   * Update a model in mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.put = ({ body, params }: any, res: any) => {
    return defaultResponse(ModelClass.update(body, { where: { id: params.id } }), res);
  };

  /**
   * Delete a model from mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.delete = ({ params }: any, res: any) => {
    return defaultResponse(ModelClass.destroy({ where: { id: params.id } }), res);
  };

  return controller;
}
