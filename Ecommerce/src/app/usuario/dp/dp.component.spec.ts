import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPComponent } from './dp.component';

describe('DPComponent', () => {
  let component: DPComponent;
  let fixture: ComponentFixture<DPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
