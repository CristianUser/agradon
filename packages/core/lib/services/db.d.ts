import { EntitiesFileSet } from './files';
export declare class ModelRepository<ModelType> {
    model: ModelType | any;
    constructor(model: ModelType);
    find(query: any): Promise<any>;
    findOne(query: any): Promise<any>;
    findById(id: any): Promise<any>;
    create(data: any): Promise<any>;
    updateById(id: any, data: any): Promise<any>;
    update(where: any, data: any): Promise<any>;
    delete(id: any): Promise<any>;
}
export declare class DbAdapter {
    repositories: {
        [name: string]: ModelRepository<any>;
    };
    models: any;
    connect(): Promise<any>;
    loadModels(_filesSets: EntitiesFileSet): this;
    getModel(name: string): any;
    getRepository(modelName: string): ModelRepository<any>;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=db.d.ts.map