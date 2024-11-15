import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carro2Component } from './carro2.component';

describe('Carro2Component', () => {
  let component: Carro2Component;
  let fixture: ComponentFixture<Carro2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carro2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carro2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
