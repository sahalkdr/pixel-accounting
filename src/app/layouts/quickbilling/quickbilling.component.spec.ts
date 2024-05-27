import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickbillingComponent } from './quickbilling.component';

describe('QuickbillingComponent', () => {
  let component: QuickbillingComponent;
  let fixture: ComponentFixture<QuickbillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickbillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
