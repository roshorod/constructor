import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolComponentsComponent } from './tool-components.component';

describe('ToolComponentsComponent', () => {
  let component: ToolComponentsComponent;
  let fixture: ComponentFixture<ToolComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
