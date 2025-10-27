import { TestBed } from '@angular/core/testing';

import { SubirFacturaService } from './subir-factura.service';

describe('SubirFacturaService', () => {
  let service: SubirFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubirFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
