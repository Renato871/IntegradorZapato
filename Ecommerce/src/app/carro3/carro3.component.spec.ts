import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carro3Component } from './carro3.component';

describe('Carro3Component', () => {
  let component: Carro3Component;
  let fixture: ComponentFixture<Carro3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carro3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carro3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
