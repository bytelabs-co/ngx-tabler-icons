import { normalize, strings, workspaces, } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { createHost } from '../_util/create-host.function';
import { Schema as IconComponentSchema } from './schema';

import { parse as svgParse, stringify as svgStringify } from 'svgson';

export function iconComponent(_options: IconComponentSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    const project = _options.project != null ? workspace.projects.get(_options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${_options.project}`);
    }

    const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    if (_options.path === undefined) {
      _options.path = `${project.sourceRoot}/${projectType}`;
    }

    const svgTemplate = await paramterizeSvgTemplate(_options.svgTemplate);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: _options.name,
        applyStrokeColor: _options.style === 'outline' ? true : false,
        applyFillColor: _options.style === 'outline' ? false : true,
        svgTemplate: svgTemplate
      }),
      move(normalize(_options.path as string)),
    ]);

    return chain([mergeWith(templateSource)]);

  };
}

async function paramterizeSvgTemplate(svgTemplate: string): Promise<string> {

  const svg = await svgParse(svgTemplate);

  overwriteAttribute(svg, 'width', '{{ size() }}');
  overwriteAttribute(svg, 'height', '{{ size() }}');
  overwriteAttribute(svg, 'stroke', '{{ strokeColor() }}');
  overwriteAttribute(svg, 'fill', '{{ fillColor() }}');
  overwriteAttribute(svg, 'stroke-width', '{{ stroke() }}');

  return svgStringify(svg);
}

function overwriteAttribute(svg: any, attributeName: string, value: any): void {

  if (!svg.attributes) {
    return;
  }

  delete svg.attributes[attributeName];
  svg.attributes[`attr.${attributeName}`] = value;

}