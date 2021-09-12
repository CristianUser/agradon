import glob from 'glob';
import path from 'path';
import fs from 'fs';
import jsYaml from 'js-yaml';

const loadYaml = (filePath: string) => jsYaml.load(fs.readFileSync(filePath, 'utf8'))
const EXTENSION_MAP: any = {
  yaml: loadYaml,
  yml: loadYaml,
  js: require,
  ts: require
};

export function readDirectory(entitiesPath: string) {
  glob.sync(`${entitiesPath}/**/*.*`).forEach(file => {
    const resolvedPath = path.resolve(file);
    const ext: string = path.extname(resolvedPath);
    console.log(EXTENSION_MAP[ext](resolvedPath))
  })
}
