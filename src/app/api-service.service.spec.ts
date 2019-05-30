import { TestBed } from '@angular/core/testing';

import { ApiConnexionService } from './api-service.service';

describe('ApiConnexionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiConnexionService = TestBed.get(ApiConnexionService);
    expect(service).toBeTruthy();
  });
});
