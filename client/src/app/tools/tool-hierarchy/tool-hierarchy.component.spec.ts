import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolHierarchyComponent } from './tool-hierarchy.component';

describe('ToolHierarchyComponent', () => {
  let component: ToolHierarchyComponent;
  let fixture: ComponentFixture<ToolHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
