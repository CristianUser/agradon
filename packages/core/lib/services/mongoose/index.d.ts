import mongoose from 'mongoose';
import { DbAdapter } from '../db';
import { EntitiesFileSet } from '../files';
export declare type ModelsSet = {
    [key: string]: mongoose.Model<any>;
};
export declare class MongooseDB implements DbAdapter {
    repositories: {
        [key: string]: any;
    };
    type: string;
    mongoose: mongoose.Mongoose;
    models: ModelsSet;
    constructor(mongoose: mongoose.Mongoose);
    connect(): Promise<mongoose.Connection>;
    loadModels(filesSets: EntitiesFileSet): this;
    getModel(name: string): mongoose.Model<any, {}, {}, {}>;
    getRepository(modelName: string): any;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=index.d.ts.map