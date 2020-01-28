import { TestBed } from '@angular/core/testing';

import { SincronizacaoServiceService } from './sincronizacao-service.service';

describe('SincronizacaoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SincronizacaoServiceService = TestBed.get(SincronizacaoServiceService);
    expect(service).toBeTruthy();
  });
});
