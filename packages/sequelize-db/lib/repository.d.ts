import { ModelRepository } from '@agradon/core';
import { Model, ModelCtor } from 'sequelize';
declare type FindQuery = {
    where?: any;
    sortBy?: any[];
    limit?: number;
    offset?: number;
};
export declare class SequelizeRepository extends ModelRepository<ModelCtor<Model>> {
    model: ModelCtor<Model>;
    create(data: any): Promise<any>;
    find({ where, sortBy, offset, limit }: FindQuery): Promise<any>;
    findById(id: string): Promise<any>;
    update(where: any, data: any): Promise<any>;
    updateById(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=repository.d.ts.map