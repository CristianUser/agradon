import { ModelRepository } from '@agradon/core';
import { Model, ModelCtor } from 'sequelize';

type FindQuery = {
  where?: any;
  sortBy?: any[];
  limit?: number;
  offset?: number;
};

export class SequelizeRepository extends ModelRepository<ModelCtor<Model>> {
  public model!: ModelCtor<Model>;

  async create(data: any): Promise<any> {
    const newDocument = await this.model.create(data);
    const doc = (await newDocument.save()).toJSON();

    return doc;
  }

  find({ where, sortBy, offset = 0, limit = 10 }: FindQuery): Promise<any> {
    const order: any = sortBy?.map(
      (item) => Object.entries(item).map(([key, value = 'ASC']) => [key, value])[0]
    );

    return this.model.findAndCountAll({ where, offset, limit, order });
  }

  findById(id: string): Promise<any> {
    return this.model.findByPk(id);
  }

  update(where: any, data: any): Promise<any> {
    return this.model.update(data, { where, returning: true });
  }

  updateById(id: string, data: any): Promise<any> {
    return this.model.update(data, { where: { id }, returning: true });
  }

  delete(id: string): Promise<any> {
    return this.model.destroy({ where: { id } });
  }
}

export default {};
