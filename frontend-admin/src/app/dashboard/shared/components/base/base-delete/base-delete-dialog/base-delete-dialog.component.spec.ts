import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDeleteDialogComponent } from './base-delete-dialog.component';

describe('BaseDeleteDialogComponent', () => {
  let component: BaseDeleteDialogComponent;
  let fixture: ComponentFixture<BaseDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
