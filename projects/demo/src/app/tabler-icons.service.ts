import { computed, Injectable, signal } from '@angular/core';
import Fuse from 'fuse.js';

import iconsJson from '../../../../node_modules/@tabler/icons/icons.json';

const icons = iconsJson as { [key: string]: RawIconDefinition };

interface IconStyle {
  version: string;
  unicode: string;
}

interface RawIconDefinition {
  name: string;
  category: string;
  tags: string[];
  styles: { [name: string]: IconStyle }
}

export interface IconDefinition {
  name: string;
  iconName: string;
  style: string;
  category: string;
  tags: string[];
  version: string;
}

interface FindIconsParams {
  page?: number;
  itemsPerPage?: number;
  search?: string;
}

interface FindIconsCommand {
  page: number;
  itemsPerPage: number;
}

const defaultFindIconsParams: FindIconsCommand = {
  page: 1,
  itemsPerPage: 60
}

interface FindIconsResults {
  total: number;
  data: IconDefinition[];
}

@Injectable({
  providedIn: 'root'
})
export class TablerIconsService {

  #tablerIcons = signal<IconDefinition[]>([]);

  #categories = signal<string[]>([]);

  #searchIndex = computed(() => {

    const icons = this.#tablerIcons();

    const fuse = new Fuse(icons, {
      keys: ['name', 'tags']
    })

    return fuse;
  });

  constructor() {

    const iconDefinitions: IconDefinition[] = [];
    const categorySet = new Set<string>();

    for (let iconDefinitionName of Object.keys(icons)) {
      const rawIconDefinition = icons[iconDefinitionName];

      for (let iconDefintionStyleName of (Object.keys(rawIconDefinition.styles))) {

        const style = rawIconDefinition.styles[iconDefintionStyleName];

        let iconName = rawIconDefinition.name;
        if (iconDefintionStyleName !== 'outline') {
          iconName = `${iconName}-${iconDefintionStyleName}`;
        }

        iconName = this.iconizeName(iconName);

        const iconDefinition: IconDefinition = {
          name: rawIconDefinition.name,
          category: rawIconDefinition.category,
          tags: rawIconDefinition.tags,
          iconName: iconName,
          style: iconDefintionStyleName,
          version: style.version
        }

        if (!!rawIconDefinition.category) {
          categorySet.add(rawIconDefinition.category);
        }

        iconDefinitions.push(iconDefinition);
      }
    }

    this.#tablerIcons.set(iconDefinitions);
    this.#categories.set(Array.from(categorySet));
  }

  public listIcons(params?: FindIconsParams): { data: IconDefinition[], total: number } {

    const listResults: FindIconsResults = { data: [], total: 0 };

    const p = { ...defaultFindIconsParams, ...params ?? {} };

    if (p.page < 1) {
      p.page = defaultFindIconsParams.page;
    }

    if (p.itemsPerPage < 1) {
      p.itemsPerPage = defaultFindIconsParams.itemsPerPage;
    }

    const sliceStart = (p.page - 1) * p.itemsPerPage;
    const sliceStop = p.page * p.itemsPerPage;

    const tablerIcons = this.#tablerIcons();

    if (!!p.search) {
      let results = this.#searchIndex().search(p.search);
      listResults.total = results.length;

      results = results.slice(sliceStart, sliceStop);

      const matchedIcons = results.map(r => tablerIcons[r.refIndex]);

      listResults.data = matchedIcons;
    } else {
      const max = Math.min(sliceStop, this.#tablerIcons().length);

      for (let i = sliceStart; i < max; i++) {
        const icon = tablerIcons[i];
        listResults.data.push(icon);
      }

      listResults.total = tablerIcons.length;
    }

    return listResults;
  }

  private iconizeName(name: string): string {

    const pascaledName = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    const iconizedName = `TablerIcon${pascaledName}`;

    return iconizedName;
  }
}
