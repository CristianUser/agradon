declare type ControllerFile = (router: any, model: any) => void;
declare type ModelFile = {
    schema: (schema: any) => void;
};
export interface EntitiesFileSet {
    [entityName: string]: {
        controller: ControllerFile;
        model: ModelFile;
        [fileName: string]: any;
    };
}
export interface FileGroup<T = any> {
    [entityName: string]: ControllerFile | ModelFile | T;
}
export declare function readDirectory(entitiesPath: string): EntitiesFileSet;
export declare function getFileGroup(fileSets: EntitiesFileSet, fileName: string): FileGroup;
export {};
//# sourceMappingURL=files.d.ts.map