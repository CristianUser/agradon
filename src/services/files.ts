import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import jsYaml from 'js-yaml';

let entitiesFileSet = {};
const loadYaml = (filePath: string) => jsYaml.load(fs.readFileSync(filePath, 'utf8'));
const EXTENSION_LOADER: any = {
  '.yaml': loadYaml,
  '.yml': loadYaml,
  '.js': require,
  '.ts': require,
  '.json': require
};

type ControllerFile = (router: any, model: any) => void;
type ModelFile = {
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

export function readDirectory(entitiesPath: string): EntitiesFileSet {
  const entities = {};

  glob.sync(`${entitiesPath}/**/*.*`).forEach((file) => {
    const resolvedPath = path.resolve(file);
    const { dir, ext, name } = path.parse(file);
    const entityName = dir.split('/').pop() || '';
    const fileName = name;

    _.set(entities, [entityName, fileName], EXTENSION_LOADER[ext](resolvedPath));
  });

  entitiesFileSet = entities
  return entities;
}

export function getFileGroup(fileSets: EntitiesFileSet, fileName: string): FileGroup {
  return Object.entries(fileSets).reduce((prev: FileGroup, [entityName, fileSet]) => {
    prev[entityName] = fileSet[fileName];
    return prev;
  }, {});
}

export function getModels() {
  return getFileGroup(entitiesFileSet, 'model');
}
