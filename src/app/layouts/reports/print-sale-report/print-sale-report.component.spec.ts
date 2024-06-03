import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReportComponent } from './print-sale-report.component';

describe('PrintSaleReportComponent', () => {
  let component: PrintSaleReportComponent;
  let fixture: ComponentFixture<PrintSaleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintSaleReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
