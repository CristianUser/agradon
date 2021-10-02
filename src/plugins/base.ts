/* eslint-disable class-methods-use-this */
import { Express } from 'express';

// eslint-disable-next-line import/no-cycle
import { AgradonConfig } from '../init';
import { EntitiesFileSet } from '../services/files';

export abstract class AgradonPlugin {
  load(app: Express, fileSets: EntitiesFileSet, agradonConfig: AgradonConfig): void {
    console.log({ app, fileSets, agradonConfig });
  }
}

export default {};
