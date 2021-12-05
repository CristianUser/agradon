/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { EntitiesFileSet } from './files';

export class ModelRepository<ModelType> {
  public model: ModelType | any;

  constructor(model: ModelType) {
    this.model = model;
  }

  async find(query: any) {
    return this.model.find(query);
  }

  async findOne(query: any) {
    return this.model.findOne(query);
  }

  async findById(id: any) {
    return this.model.findById(id);
  }

  async create(data: any) {
    return this.model.create(data);
  }

  async updateById(id: any, data: any) {
    return this.model.findByIdAndUpdate(id, data);
  }

  async update(where: any, data: any) {
    return this.model.findByIdAndUpdate(where, data);
  }

  async delete(id: any) {
    return this.model.findByIdAndDelete(id);
  }
}

export class DbAdapter {
  public repositories: { [name: string]: ModelRepository<any> } = {};

  public models: any = {};

  public async connect(): Promise<any> {
    return Promise.resolve();
  }

  public loadModels(_filesSets: EntitiesFileSet) {
    return this;
  }

  public getModel(name: string) {
    return this.models[name];
  }

  public getRepository(modelName: string) {
    return this.repositories[modelName];
  }
}

export default {};
