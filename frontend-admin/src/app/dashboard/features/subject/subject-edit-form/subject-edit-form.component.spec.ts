import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectEditFormComponent } from './subject-edit-form.component';

describe('SubjectEditFormComponent', () => {
  let component: SubjectEditFormComponent;
  let fixture: ComponentFixture<SubjectEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
