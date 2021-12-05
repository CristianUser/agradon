import { Router } from 'express';
import passport from 'passport';
import { AgradonConfig } from '../../init';
import { EntitiesFileSet } from '../../services/files';
import { AgradonPlugin } from '../base';
export declare function registerStrategies(strategies?: passport.Strategy[]): void;
export declare function mergeStrategies(strategies: passport.Strategy[], newStrategies: passport.Strategy[]): passport.Strategy[];
declare const _default: {};
export default _default;
export declare class AuthPlugin extends AgradonPlugin {
    config: any;
    constructor(config?: any);
    load(app: Router, fileSets: EntitiesFileSet, { rootPath }: AgradonConfig): void;
}
export * from './utils';
//# sourceMappingURL=index.d.ts.map