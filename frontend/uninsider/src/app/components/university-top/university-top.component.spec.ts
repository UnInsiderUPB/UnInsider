import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityTopComponent } from './university-top.component';

describe('UniversityTopComponent', () => {
  let component: UniversityTopComponent;
  let fixture: ComponentFixture<UniversityTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniversityTopComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UniversityTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
