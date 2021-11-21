/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { EntitiesFileSet } from './files';

export abstract class DbAdapter {
  public models: any;

  public async connect(): Promise<any> {
    return Promise.resolve();
  }

  public loadModels(_filesSets: EntitiesFileSet) {
    return this;
  }

  public getModel(name: string) {
    return this.models[name];
  }

  public createCrudHandlers(modelName: string) {}
}

export default DbAdapter;
