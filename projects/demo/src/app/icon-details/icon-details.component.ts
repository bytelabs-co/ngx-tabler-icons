import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TablerIconClipboardCopyComponent } from "@bytelabs/ngx-tabler-icons";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IconDefinition } from '../tabler-icons.service';

@Component({
  selector: 'app-icon-details',
  imports: [
    CommonModule,
    TablerIconClipboardCopyComponent,
    NgbTooltipModule
  ],
  templateUrl: './icon-details.component.html',
  styleUrl: './icon-details.component.css'
})
export class IconDetailsComponent {

  icon = input.required<IconDefinition>();
  iconComponent = input<any>();

  private readonly _tagNameSuffix = computed(() => {
    const style = this.icon().style;
    return this.icon().style === 'outline' ? '' : `-${style}`;
  });

  private readonly _tagNameBase = computed(() => `${this.icon().name}${this._tagNameSuffix()}`)

  private readonly _tagName = computed(() => `tabler-icon-${this._tagNameBase()}`);
  private readonly _tagNameAlt = computed(() => `ti-${this._tagNameBase()}`);

  public readonly iconComponentName = computed(() => `${this.icon().iconName}Component`);
  public readonly iconTag = computed(() => `<${this._tagName()}/>`)
  public readonly iconTagAlt = computed(() => `<${this._tagNameAlt()}/>`)

  constructor() {

  }

  copyToClipboard(value: string) {
    try {
      navigator.clipboard.writeText(value);
    }
    catch (err) {
      console.log(err);
    }
  }

}
