import { normalize, workspaces } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, schematic, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { IconDefinition } from '../_models/icon-definition';
import { createHost } from '../_util/create-host.function';
import { Schema as IconComponentSchema } from '../icon-component/schema';
import { Schema as GenerateIconsSchema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generateIcons(_options: GenerateIconsSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    const host = createHost(tree);
    const {workspace} = await workspaces.readWorkspace('/', host);

    const project = _options.project != null ? workspace.projects.get(_options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${_options.project}`);
    }

    const iconsBuffer = tree.read("node_modules/@tabler/icons/icons.json");
    if(iconsBuffer === null){
      throw new SchematicsException("Could not load icons.json from @tabler/icons");
    }

    const icons = JSON.parse(iconsBuffer.toString()) as {[key: string]: IconDefinition };

    const rules: Rule[] = [];
    const barrelExports: string[] = [];

    const iconsRootPath = `${project.sourceRoot}/lib/icons`;

    for(let iconName of Object.keys(icons)){

      const iconDef = (<any>icons)[iconName] as IconDefinition;

      for(let styleKey of Object.keys(iconDef.styles)){

        const svgPath = `node_modules/@tabler/icons/icons/${styleKey}/${iconDef.name}.svg`;

        const styleModifier = styleKey === 'outline' ? '' : `-${styleKey}`;

        const name = `${iconDef.name}${styleModifier}`;
        barrelExports.push(getBarrelExportForComponent(name));

        const svgBuffer = tree.read(svgPath);
        if(svgBuffer != null){

          const svgContent = svgBuffer.toString();

          const iconComponentOptions: IconComponentSchema = {
            name: name,
            svgTemplate: svgContent,
            path: iconsRootPath,
            project: _options.project
          }

          var iconComponentSchematic = schematic('icon-component', iconComponentOptions);

          rules.push(iconComponentSchematic);

        } else{
          _context.logger.warn(`File not found: ${svgPath}`);
        }
      }
    }

    _context.logger.info(`Creating ${rules.length} Icon Components`);

    // Chunk the rules
    const ruleChunks: Rule[] = [];

    const chunkSize = 1000;

    for (let i = 0; i < rules.length; i += chunkSize) {
      const chunk = rules.slice(i, i + chunkSize)
      ruleChunks.push(chain(chunk));
    }

    const templateSource = apply(url('./files'), [
      applyTemplates({ 
        exports: barrelExports.sort((a, b) => a.localeCompare(b))
      }),
      move(normalize(iconsRootPath as string)),
    ]);

    return chain(
      [
        chain([mergeWith(templateSource)]),
        chain(ruleChunks)
      ])
      
  };
}

function getBarrelExportForComponent(name: string): string{

  const component = `icon-${name}.component`;

  const componentExport = `export * from './${component}';`

  return componentExport;
}
