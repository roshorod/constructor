import {
  AfterViewInit, Component,
  Input, NgModule, OnInit
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
import { debounceTime } from 'rxjs/operators';
import { ModeButtonDirective } from "./mode-button.directive";
import { PropertiesComponent } from "./properties.component";

@Component({
  selector: 'app-inspector',
  templateUrl: 'inspector.component.html',
  styleUrls: ['inspector.component.css'],
})
export class InspectorComponent implements OnInit, AfterViewInit {
  @Input() public debug?: boolean;

  @Input() public set element(element: Element | null | undefined) {
    this.elementGroup$ = this.fb.group({ ...element });

    this.elementGroup$.valueChanges
      .subscribe(element => {
        this.store.update(element)
          .subscribe(element => {
            this.store.select(element);
        })
      });
  }

  public elementGroup$: FormGroup;
  public settingsGroup$: FormGroup;

  public settingsPayload: Settings;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    public store: StoreService
  ) { }

  ngOnInit() {
    this.settingsService.settings$
      .subscribe((settings: Settings) => {
        this.settingsPayload = settings;
        this.settingsGroup$ = this.fb.group({ ...settings });
      })
      .unsubscribe();

    this.settingsGroup$.valueChanges
      .pipe(debounceTime(500))
      .subscribe((settings) => {
        this.settingsPayload = settings;
        this.settingsService.update(settings);
      });


  }

  ngAfterViewInit() {
    this.settingsService.settings$
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
      .subscribe(element => {
        this.store.select(element);
      });
  }

  public onResetBackground() {
    const signature: Element = {
      ...this.elementGroup$.value,
      background: undefined
    };

    this.store.update(signature)
      .subscribe(element => {
        this.store.select(element);
      });
  };

  public onDeleteElement() {
    const signature: Element = {
      ...this.elementGroup$.value,
    };

    this.store.remove(signature)
      .subscribe(() => this.store.select(undefined));
  }

  public onModeSelect() {
    this.settingsService.update({
      ...this.settingsPayload,
      mode: RendererMode.select
    })
      .subscribe((last) => this.settingsPayload = last)
      .unsubscribe();
  }

  public onModeCreate() {
    this.settingsService.update({
      ...this.settingsPayload,
      mode: RendererMode.create
    })
      .subscribe((last) => this.settingsPayload = last)
      .unsubscribe();
  }

  public onModeResize() {
    this.settingsService.update({
      ...this.settingsPayload,
      mode: RendererMode.resize
    })
      .subscribe((last) => this.settingsPayload = last)
      .unsubscribe();
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
