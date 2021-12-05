import { Router } from 'express';
import { DbAdapter } from './services/db';
export declare type HTTPMethod = 'get' | 'post' | 'put' | 'delete';
export declare function createCrudRoutes(router: Router, controller: any): Router;
export declare function createDefaultCRUD(router: Router, modelName: string, db: DbAdapter): Router;
//# sourceMappingURL=crud.d.ts.map