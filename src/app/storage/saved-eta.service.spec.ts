import { TestBed } from '@angular/core/testing';

import { SavedEtaService } from './saved-eta.service';

describe('SavedEtaService', () => {
  let service: SavedEtaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedEtaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
