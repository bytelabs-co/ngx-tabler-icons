import { inject, Injectable, InjectionToken, signal } from '@angular/core';
import { TablerIconsConfig } from './tabler-icons.config';

export const TABLER_ICON_CONFIG_TOKEN = 'TABLER_ICON_CONFIG_TOKEN';
export const TABLER_ICON_CONFIG= new InjectionToken<TablerIconsConfig>(TABLER_ICON_CONFIG_TOKEN);


@Injectable()
export class TablerIconsSettingsService {

  private readonly tablerIconsConfig: TablerIconsConfig = inject(TABLER_ICON_CONFIG);

  public readonly size = signal<string>(this.tablerIconsConfig.size);

  public readonly color = signal<string>(this.tablerIconsConfig.color);

  public readonly stroke = signal<string>(this.tablerIconsConfig.stroke);

}