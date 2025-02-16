import { Component, inject, input } from '@angular/core';
import { TablerIconsSettingsService } from './tabler-icons-settings.service';

@Component({
  selector: '<!--tabler-icon-base-->',
  template: ''
})
export class TablerIconBaseComponent {

  private readonly tablerIconsSettingsServce = inject(TablerIconsSettingsService); 

  size = input<string>(this.tablerIconsSettingsServce.size());

  color = input<string>(this.tablerIconsSettingsServce.color());

  stroke = input<string>(this.tablerIconsSettingsServce.stroke());
}