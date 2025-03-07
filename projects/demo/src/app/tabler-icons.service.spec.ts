import { TestBed } from '@angular/core/testing';

import { TablerIconsService } from './tabler-icons.service';

describe('TablerIconsService', () => {
  let service: TablerIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablerIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
