/* eslint-disable class-methods-use-this */
import { Model } from 'mongoose';
import { ModelRepository } from '../db';

type FindQuery = {
  where?: any;
  sortBy?: any[];
  limit?: number;
  offset?: number;
};

export class MongooseRepository extends ModelRepository<Model<any>> {
  public model!: Model<any>;

  async create(data: any): Promise<any> {
    // eslint-disable-next-line new-cap
    const newDocument = new this.model(data);

    return newDocument.save();
  }

  find({ where, sortBy, offset = 0, limit = 10 }: FindQuery): Promise<any> {
    return this.model
      .find(where, { skip: offset, limit })
      .sort(sortBy)
      .then((res) => res);
  }

  findById(id: string): Promise<any> {
    return this.model.findById(id).then((res) => res);
  }

  update(where: any, data: any): Promise<any> {
    return this.model.updateMany(where, data).then((res) => res);
  }

  updateById(id: string, data: any): Promise<any> {
    return this.model.updateOne({ id }, data).then((res) => res);
  }

  delete(id: string): Promise<any> {
    return this.model.deleteOne({ id }).then((res) => res);
  }
}

export default {};
