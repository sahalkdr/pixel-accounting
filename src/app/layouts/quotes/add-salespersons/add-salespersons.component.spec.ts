import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalespersonsComponent } from './add-salespersons.component';

describe('AddSalespersonsComponent', () => {
  let component: AddSalespersonsComponent;
  let fixture: ComponentFixture<AddSalespersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSalespersonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSalespersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
