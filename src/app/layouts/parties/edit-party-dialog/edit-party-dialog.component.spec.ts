import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartyDialogComponent } from './edit-party-dialog.component';

describe('EditPartyDialogComponent', () => {
  let component: EditPartyDialogComponent;
  let fixture: ComponentFixture<EditPartyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPartyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPartyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
