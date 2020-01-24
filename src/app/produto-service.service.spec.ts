import { TestBed } from '@angular/core/testing';

import { ProdutoServiceService } from './produto-service.service';

describe('ProdutoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProdutoServiceService = TestBed.get(ProdutoServiceService);
    expect(service).toBeTruthy();
  });
});
