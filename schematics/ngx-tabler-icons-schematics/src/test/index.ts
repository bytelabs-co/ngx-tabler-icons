import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema as TestSchama } from './schema';

export function test(_options: TestSchama): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    _context.logger.info("Test")

    return tree;

  }
}