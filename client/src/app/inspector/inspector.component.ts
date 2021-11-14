import { AfterViewInit, Component, Input, NgModule, OnChanges, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { BrowserModule } from "@angular/platform-browser";
import { Element } from "@renderer/models/element";
import { settings } from "@renderer/models/settings";
import { ApiClientSerivce } from "@renderer/services/api-client.service";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ModeButtonDirective } from "./mode-button.directive";
import { PropertiesComponent } from "./properties.component";

@Component({
  selector: 'app-inspector',
  template: `
  <mat-accordion multi>
    <ng-container *ngIf="this.element">
      <properties title="Element">
        <form [formGroup]="this.elementGroup$">
          <div class="inspector-item" *ngIf="this.debug" style="user-select: text;">
            <label>{{this.elementId$.value}}</label>
          </div>
          <div class="inspector-item">
            <label for="element-content">Content:</label>
            <input id="element-content" type="text"
              formControlName="elementContent">
          </div>
          <div class="inspector-item">
            <label for="element-color">Text color:</label>
            <input id="element-color" type="color" formControlName="elementColor">
          </div>
          <div class="inspector-item">
            <label for="element-background">Background:</label>
            <input id="element-background" type="color" formControlName="elementBackground">
          </div>
          <div class="inspector-item">
            <label>Reset:</label>
            <div class="inspector-item-group">
              <button mat-raised-button (click)="onResetBackground()">Backgorund</button>
              <button mat-raised-button (click)="onResetColor()">Color</button>
            </div>
          </div>
          <div class="inspector-item">
            <label for="element-top">Resize top:</label>
            <input id="element-top" type="checkbox"
              formControlName="elementTop">
          </div>
          <div class="inspector-item">
            <label for="element-left">Resize left:</label>
            <input id="element-left" type="checkbox"
              formControlName="elementLeft">
          </div>
          <div class="inspector-item">
            <label for="element-right">Resize right:</label>
            <input id="element-right" type="checkbox"
              formControlName="elementRight">
          </div>
          <div class="inspector-item">
            <label for="element-bottom">Resize bottom:</label>
            <input id="element-bottom" type="checkbox"
              formControlName="elementBottom">
          </div>
        </form>
      </properties>
    </ng-container>
    <properties title="Workspace">
      <div class="inspector-item workspace-block">
        <label>Mode:</label>
        <div class="workspace-group">
          <button mat-raised-button mode-button
            [target]="0"
            [mode]="this.settings.mode"
            (click)="onModeSelect()">
            Select
          </button>
          <button mat-raised-button mode-button
            [target]="1"
            [mode]="this.settings.mode"
            (click)="onModeCreate()">
            Create
          </button>
        </div>
      </div>
    </properties>
    <properties title="Grid">
      <form [formGroup]="this.gridGroup$">
        <div class="inspector-item">
          <label for="grid-lines">Lines</label>
          <input id="grid-lines" type="checkbox"
            formControlName="gridLines">
        </div>
        <div class="inspector-item">
          <label for="grid-corners">Corners:</label>
          <input id="grid-corners" type="checkbox"
            formControlName="gridCorners">
        </div>
        <div class="inspector-item">
          <label for="grid-rows">Rows:</label>
          <input id="grid-rows" type="number"
            formControlName="gridRows">
        </div>
        <div class="inspector-item">
          <label for="grid-columns">Columns:</label>
          <input id="grid-columns" type="number"
            formControlName="gridColumns">
        </div>
      </form>
    </properties>
  </mat-accordion>`,
  styleUrls: ['inspector.component.css'],
})
export class InspectorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public element?: Element;
  @Input() public settings: settings;
  @Input() public debug?: boolean;

  public elementId$ = new FormControl()
  public elementGroup$ = new FormGroup({
    elementContent: new FormControl(),

    elementColor: new FormControl(),
    elementBackground: new FormControl(),

    elementTop: new FormControl(true),
    elementLeft: new FormControl(true),
    elementRight: new FormControl(true),
    elementBottom: new FormControl(true),
  });

  public gridGroup$ = new FormGroup({
    gridRows: new FormControl(),
    gridColumns: new FormControl(),

    gridLines: new FormControl(true),
    gridCorners: new FormControl(true),
    gridBackground: new FormControl()
  });

  public unsubTrigger$ = new Subject();

  constructor(private api: ApiClientSerivce) { }

  ngAfterViewInit() {
    const settings = this.settings;

    this.gridGroup$.setValue({
      gridRows: settings.rows,
      gridColumns: settings.columns,

      gridLines: settings.lines,
      gridCorners: settings.corners,
      gridBackground: ''
    });

    const content$ = (<FormControl>this.elementGroup$.get('elementContent')).valueChanges;
    const color$ = (<FormControl>this.elementGroup$.get('elementColor')).valueChanges;
    const background$ = (<FormControl>this.elementGroup$.get('elementBackground')).valueChanges;
    const top$ = (<FormControl>this.elementGroup$.get('elementTop')).valueChanges;
    const left$ = (<FormControl>this.elementGroup$.get('elementLeft')).valueChanges;
    const right$ = (<FormControl>this.elementGroup$.get('elementRight')).valueChanges;
    const bottom$ = (<FormControl>this.elementGroup$.get('elementBottom')).valueChanges;

    const lines$ = (<FormControl>this.gridGroup$.get('gridLines')).valueChanges;
    const corners$ = (<FormControl>this.gridGroup$.get('gridCorners')).valueChanges;
    const rows$ = (<FormControl>this.gridGroup$.get('gridRows')).valueChanges;
    const columns$ = (<FormControl>this.gridGroup$.get('gridColumns')).valueChanges;

    // https://kelly-kh-woo.medium.com/rxjs-better-practice-b573a9dac874
    content$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: string) => {
      if(this.element)
        this.element.content = val;
    });
    color$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: string) => {
      if(this.element)
        this.element.color = val;
    });
    background$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: string) => {
      if(this.element)
        this.element.background = val;
    });
    top$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: boolean) => {
      if(this.element)
        this.element.resizeTop = val;
    });
    left$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: boolean) => {
      if (this.element)
        this.element.resizeLeft = val;
    });
    right$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: boolean) => {
      if (this.element)
        this.element.resizeRight = val;
    });
    bottom$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: boolean) => {
      if (this.element)
        this.element.resizeBottom = val;
    });

    lines$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: boolean) => {
      settings.lines = val;
    });
    corners$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: boolean) => {
      settings.corners = val;
    });
    rows$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: number) => {
      if (val == null)
        console.error('Bad rows count. Enter a valid number!');
      else
        settings.rows = val;
    });
    columns$.pipe(takeUntil(this.unsubTrigger$)).subscribe((val: number) => {
      if (val == null)
        console.error('Bad columns count. Enter a valid number!');
      else
        settings.columns = val;
    });

    this.elementGroup$.valueChanges.pipe(
      takeUntil(this.unsubTrigger$),
      debounceTime(5000)
    ).subscribe(() => {
      if(this.element)
        this.api.postElementById(this.element).subscribe();
      else
        console.warn("Can't reach server. Check server connection!");
    });
  }

  ngOnChanges() {
    const element = this.element;

    if (element) {
      if (this.debug)
        this.elementId$.setValue(element?.id)

      this.elementGroup$.setValue({
        elementContent: element?.content,

        elementColor: element?.color ? element?.color : '#000000',
        elementBackground: element?.background ? element?.background : '',

        elementTop: element?.resizeTop ? element?.resizeTop : false,
        elementLeft: element?.resizeLeft ? element?.resizeLeft : false,
        elementRight: element?.resizeRight ? element?.resizeRight : false,
        elementBottom: element?.resizeBottom ? element?.resizeBottom : false,
      });
    }
  }

  public onResetColor() {
    if (this.element)
      this.element.color = '#000000';
  }

  public onResetBackground() {
    if (this.element)
      this.element.background = '';
  };

  public onModeSelect() {
    this.settings.mode = 0;
  }

  public onModeCreate() {
    this.settings.mode = 1;
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
  ],
  declarations:[
    InspectorComponent,
    PropertiesComponent,
    ModeButtonDirective
  ]
})
export class InspectorModule { }
