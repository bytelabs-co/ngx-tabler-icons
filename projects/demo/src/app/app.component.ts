import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TablerIconsSettingsService } from '@bytelabs/ngx-tabler-icons';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { IconCardComponent } from './icon-card/icon-card.component';
import { IconDefinition, TablerIconsService } from './tabler-icons.service';


@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    CommonModule,
    IconCardComponent,
    NgbPaginationModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private readonly tablerIconsSettingsService = inject(TablerIconsSettingsService);
  private readonly tablerIconsService = inject(TablerIconsService);

  #totalIcons = signal<number>(0);

  public readonly itemsPerPage = signal<number>(240);
  public readonly page = signal<number>(1);
  public readonly search = signal<string>('');

  public readonly icons = signal<IconDefinition[]>([]);
  public readonly totalIcons = computed(() => this.#totalIcons());

  constructor() {

    const page$ = toObservable(this.page).pipe(distinctUntilChanged());
    const itemsPerPage$ = toObservable(this.itemsPerPage).pipe(distinctUntilChanged());
    const search$ = toObservable(this.search).pipe(
      debounceTime(250),
      distinctUntilChanged()
    );


    combineLatest([
      page$,
      itemsPerPage$,
      search$
    ]).pipe(
      takeUntilDestroyed()
    ).subscribe(([page, itemsPerPage, search]) => {

      const results = this.tablerIconsService.listIcons({
        page: page,
        itemsPerPage: itemsPerPage,
        search: search
      });

      this.icons.set(results.data);
      this.#totalIcons.set(Math.ceil(results.total));
    });

    this.tablerIconsSettingsService.size.set('24px');

  }
}