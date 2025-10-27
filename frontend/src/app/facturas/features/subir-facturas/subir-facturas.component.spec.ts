import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirFacturasComponent } from './subir-facturas.component';

describe('SubirFacturasComponent', () => {
  let component: SubirFacturasComponent;
  let fixture: ComponentFixture<SubirFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirFacturasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
