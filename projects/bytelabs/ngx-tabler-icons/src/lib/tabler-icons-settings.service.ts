import { inject, Injectable, InjectionToken, Optional, signal } from '@angular/core';
import { defaultConfig, TablerIconsConfig } from './tabler-icons.config';

export const TABLER_ICON_CONFIG_TOKEN = 'TABLER_ICON_CONFIG_TOKEN';
export const TABLER_ICON_CONFIG = new InjectionToken<TablerIconsConfig>(TABLER_ICON_CONFIG_TOKEN);


@Injectable()
export class TablerIconsSettingsService {

  @Optional()
  private readonly tablerIconsConfig: TablerIconsConfig = inject(TABLER_ICON_CONFIG);

  public readonly size = signal<string>(this.tablerIconsConfig?.size ?? defaultConfig.size);

  public readonly color = signal<string>(this.tablerIconsConfig?.color ?? defaultConfig.color);

  public readonly stroke = signal<string>(this.tablerIconsConfig?.stroke ?? defaultConfig.stroke);

}