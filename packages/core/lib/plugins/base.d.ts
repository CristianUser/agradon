import { Express } from 'express';
import { AgradonConfig } from '../init';
import { EntitiesFileSet } from '../services/files';
export declare abstract class AgradonPlugin {
    load(app: Express, fileSets: EntitiesFileSet, agradonConfig: AgradonConfig): void;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=base.d.ts.map