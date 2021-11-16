import { ComponentFixture, TestBed } from '@angular/core/testing';
/*
 * Look at doc for angular material test
 * https://material.angular.io/guide/using-component-harnesses
 */
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { AppComponent } from '../app/app.component';
import { AppModule } from 'src/app/app.module';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';

describe('AppComponent', () => {
  let matLoader: HarnessLoader;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);

    matLoader = TestbedHarnessEnvironment.loader(fixture);
    if (expect(matLoader).toBeTruthy())
      console.warn("Can't load angular material components");

    const instance = fixture.componentInstance;

    if (expect(instance).toBeTruthy())
      console.warn("Can't create instance of component");
  });

  it('should have sidenav', async () => {
    const sidebar = await matLoader.getHarness(MatSidenavHarness);
    expect(sidebar).toBeTruthy();
  });
});
