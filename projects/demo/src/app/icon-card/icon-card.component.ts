import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, TemplateRef } from '@angular/core';
import * as icons from "@bytelabs/ngx-tabler-icons";
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IconDetailsComponent } from '../icon-details/icon-details.component';
import { IconDefinition } from '../tabler-icons.service';

@Component({
  selector: 'app-icon-card',
  imports: [
    CommonModule,
    IconDetailsComponent,
    icons.TablerIconXComponent,
    NgbTooltipModule
  ],
  templateUrl: './icon-card.component.html',
  styleUrl: './icon-card.component.css'
})
export class IconCardComponent {

  private readonly modalService = inject(NgbModal);

  icon = input.required<IconDefinition>();

  public readonly iconComponent = computed(() => {

    const iconDefinition = this.icon();

    const iconComponent = this.getIconComponent(iconDefinition);

    return iconComponent;
  });

  private getIconComponent(iconDefinition: IconDefinition) {

    var componentName = `${iconDefinition.iconName}Component`;

    const component = (<any>icons)[componentName];

    if (component === null) {
      console.warn(`No IconComponent for ${iconDefinition.name}`);
    }

    return component;
  }

  showIconDetails(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
}
