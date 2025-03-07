import { Component, inject, input, Optional } from '@angular/core';
import { TablerIconsSettingsService } from './tabler-icons-settings.service';
import { defaultConfig } from './tabler-icons.config';

@Component({
  selector: '<!--tabler-icon-base-->',
  template: ''
})
export class TablerIconBaseComponent {

  @Optional()
  private readonly tablerIconsSettingsService = inject(TablerIconsSettingsService);

  size = input<string>(this.tablerIconsSettingsService?.size() ?? defaultConfig.size);

  color = input<string>(this.tablerIconsSettingsService?.color() ?? defaultConfig.color);

  stroke = input<string>(this.tablerIconsSettingsService?.stroke() ?? defaultConfig.stroke);

}