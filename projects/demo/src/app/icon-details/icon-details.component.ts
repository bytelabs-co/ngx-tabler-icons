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

  private readonly _tagname = computed(() => `tabler-icon-${this.icon().name}`);
  private readonly _tagNameAlt = computed(() => `ti-${this.icon().name}`);

  public readonly iconComponentName = computed(() => `${this.icon().iconName}Component`);
  public readonly iconTag = computed(() => `<${this._tagname()}/>`)
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
