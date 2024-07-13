import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentOutComponent } from './add-payment-out.component';

describe('AddPaymentOutComponent', () => {
  let component: AddPaymentOutComponent;
  let fixture: ComponentFixture<AddPaymentOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPaymentOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPaymentOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
