import express, { Express } from 'express';
import { EntitiesFileSet } from './services/files';
import { AgradonPlugin } from './plugins/base';
import { DbAdapter } from './services/db';
export declare type AgradonConfig = {
    app: Express;
    rootPath?: string;
    db: DbAdapter;
    plugins: AgradonPlugin[];
};
export declare function registerRoutes(app: Express, { rootPath, db }: AgradonConfig, fileSets: EntitiesFileSet): void;
export declare function loadPlugins(app: Express, fileSets: EntitiesFileSet, agradonConfig: AgradonConfig): void;
export declare function init(config: AgradonConfig): Promise<void | express.Express>;
//# sourceMappingURL=init.d.ts.map