import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEditFormComponent } from './export-edit-form.component';

describe('ExportEditFormComponent', () => {
  let component: ExportEditFormComponent;
  let fixture: ComponentFixture<ExportEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
