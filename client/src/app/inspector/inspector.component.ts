import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  Input, NgModule, OnDestroy, OnInit
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { BrowserModule } from "@angular/platform-browser";
import { Element } from "@renderer/models/element";
import { RendererMode } from "@renderer/models/mode";
import { Settings } from "@renderer/models/settings";
import { SettingsService } from "@services/settings.service";
import { StoreService } from "@services/store.service";
import { Subject } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { ModeButtonDirective } from "./mode-button.directive";
import { PropertiesComponent } from "./properties.component";

@Component({
  selector: 'app-inspector',
  templateUrl: 'inspector.component.html',
  styleUrls: ['inspector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public debug?: boolean;

  @Input() public set element(element: Element | null | undefined) {
    this.elementGroup$ = this.fb.group({ ...element });

    this.elementGroup$.valueChanges
      .subscribe((element) => {
        if (element)
          this.store.update(element)
            .subscribe();
      });
  }

  public elementGroup$: FormGroup;
  public settingsGroup$: FormGroup;

  public settingsPayload: Settings;

  private unsubTrigger$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private settings: SettingsService,
    public store: StoreService
  ) { }

  ngOnInit() {
    this.settings.settings$
      .subscribe((settings: Settings) => {
        this.settingsPayload = settings;
        this.settingsGroup$ = this.fb.group({ ...settings });
      })
      .unsubscribe();

    this.settingsGroup$.valueChanges
      .pipe(debounceTime(500))
      .subscribe((settings) => {
        this.settingsPayload = settings;
        this.settings.update(settings);
      });
  }

  ngAfterViewInit() {
    this.settings.settings$
      .subscribe((settings: Settings) => {
        this.settingsPayload.mode = settings.mode;
      });
  }

  public onResetColor() {
    const signature: Element = {
      ...this.elementGroup$.value,
      color: undefined
    };
    this.store.update(signature)
      .subscribe();
    this.store.select(signature)
      .subscribe();
  }

  public onResetBackground() {
    const signature: Element = {
      ...this.elementGroup$.value,
      background: undefined
    };
    this.store.update(signature)
      .subscribe();
    this.store.select(signature)
      .subscribe();
  };

  public onDeleteElement() {
    const signature: Element = {
      ...this.elementGroup$.value,
    };

    this.store.remove(signature)
      .subscribe(() => this.store.select(undefined));
  }

  public onModeSelect() {
    this.settings.update({
      ...this.settingsPayload,
      mode: RendererMode.select
    })
      .subscribe((last) => this.settingsPayload = last)
      .unsubscribe();
  }

  public onModeCreate() {
    this.settings.update({
      ...this.settingsPayload,
      mode: RendererMode.create
    })
      .subscribe((last) => this.settingsPayload = last)
      .unsubscribe();
  }

  public onModeResize() {
    this.settings.update({
      ...this.settingsPayload,
      mode: RendererMode.resize
    })
      .subscribe((last) => this.settingsPayload = last)
      .unsubscribe();
  }

  ngOnDestroy() {
    this.unsubTrigger$.next();
    this.unsubTrigger$.complete();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    InspectorComponent,
    ModeButtonDirective
  ],
  declarations:[
    InspectorComponent,
    PropertiesComponent,
    ModeButtonDirective
  ]
})
export class InspectorModule { }
