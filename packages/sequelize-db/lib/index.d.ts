import { DbAdapter, EntitiesFileSet } from '@agradon/core';
import { Sequelize, Model, ModelCtor } from 'sequelize';
import { SequelizeRepository } from './repository';
declare type ModelsSet = {
    [key: string]: ModelCtor<Model<any>>;
};
export declare class SequelizeDB extends DbAdapter {
    type: string;
    repositories: {
        [key: string]: SequelizeRepository;
    };
    connection: Sequelize;
    models: ModelsSet;
    private syncMode;
    constructor(connection: Sequelize);
    connect(): Promise<void>;
    loadModels(filesSets: EntitiesFileSet): this;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=index.d.ts.map