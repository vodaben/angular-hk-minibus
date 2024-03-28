import { TestBed } from '@angular/core/testing';

import { MinibusDataService } from './minibus-data.service';

describe('MinibusDataService', () => {
  let service: MinibusDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinibusDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
