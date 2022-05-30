import { resolvePagination, applyMethods, parseQueryMethod } from '../query';
import { ModelRepository } from './db';

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
 * @param {Model<any>} repository
 * @returns {Object} controller
 */
export function createCrudHandlers(repository: ModelRepository<any>) {
  const controller: any = {};

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.post = async ({ body }: any, res: any, next: Function) => {
    try {
      const doc = await repository.create(body);

      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.get = ({ query }: any, res: any) => {
    const { sortBy } = parseQueryMethod(query, 'sortBy') || {};
    const { match } = parseQueryMethod(query, 'match') || {};
    // const args = resolveArguments(query);
    const { limit, skip } = resolvePagination(query) || {};

    return defaultResponse(repository.find({ where: match, sortBy, offset: skip, limit }), res);
  };

  /**
   * Add a new model to mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.getById = ({ params, query }: any, res: any) => {
    return defaultResponse(applyMethods(query, repository.findById(params.id)), res);
  };

  /**
   * Update a model in mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.put = ({ body, params }: any, res: any) => {
    return defaultResponse(repository.updateById(params.id, body), res);
  };

  /**
   * Delete a model from mongoDB
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @returns {Promise}
   */
  controller.delete = ({ params }: any, res: any) => {
    return defaultResponse(repository.delete(params.id), res);
  };

  return controller;
}
