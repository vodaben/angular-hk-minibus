import { TestBed } from '@angular/core/testing';

import { SavedRouteService } from './saved-route.service';

describe('SavedRouteService', () => {
  let service: SavedRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
