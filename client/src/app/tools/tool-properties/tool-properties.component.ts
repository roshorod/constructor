import { Component, Input, Output,
         OnChanges, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Element } from '@element/models/element';
import { SpawnPosition } from '@element/models/spawn-positions';

//For feature look at `https://stackoverflow.com/a/48130065' and `https://stackoverflow.com/a/58986966'
@Component({
  selector: 'tool-properties',
  templateUrl: './tool-properties.component.html',
  styleUrls: ['./tool-properties.component.css']
})
export class ToolPropertiesComponent implements OnChanges, OnDestroy {
  @Input() selected: Element | undefined;
  @Output() onUpdatePosition = new EventEmitter<Element>();
  @Output() onSelectedComponentPost = new EventEmitter();

  spawnPositions = SpawnPosition;

  elementForm = new FormGroup({
    content: new FormControl(''),
    position: new FormControl(''),
  });

  private contentSub: Subscription;
  private positionSub: Subscription;
  private elementFormSub: Subscription;

  ngOnChanges() {
    if (this.contentSub)
      this.contentSub.unsubscribe();
    if (this.positionSub)
      this.positionSub.unsubscribe();
    if (this.elementFormSub)
      this.elementFormSub.unsubscribe();

    if (this.selected) {
      this.elementForm.setValue({
        content: this.selected.content,
        position: this.selected.position,
      });

      const component = this.selected.component.instance;
      const contentObserver = this.elementForm.get('content') as FormControl;
      const positionObserver = this.elementForm.get('position') as FormControl;

      this.contentSub = contentObserver.valueChanges.subscribe(() => {
        if (this.selected) {
          component.content = contentObserver.value;
          component.update();
        }
      });

      this.positionSub = positionObserver.valueChanges.subscribe(() => {
        if (this.selected) {
          component.position = positionObserver.value;
          component.update();
          this.onUpdatePosition.emit(component);
        }
      });

      this.elementFormSub = this.elementForm.valueChanges.pipe(debounceTime(2000))
        .subscribe(() => {
          if(this.selected)
            this.onSelectedComponentPost.emit(
              component.id
            );
        });
    }
  }

  ngOnDestroy() {
    this.contentSub.unsubscribe();
    this.positionSub.unsubscribe();
    this.elementFormSub.unsubscribe();
  }
}
