import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTrainDataListComponent } from './export-train-data-list.component';

describe('ExportTrainDataListComponent', () => {
  let component: ExportTrainDataListComponent;
  let fixture: ComponentFixture<ExportTrainDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportTrainDataListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportTrainDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
