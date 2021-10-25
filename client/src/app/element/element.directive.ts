import { Directive, ElementRef,
         OnDestroy, OnInit} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiClientSerivce } from "../services/api-client.service";
import { SnackBarService } from "../services/snack-bar.service";
import { ElementComponent } from "./element.component";

@Directive({
  selector: '.element',
  exportAs: 'appElement'
})
export class ElementDirective implements OnDestroy, OnInit {
  private element: HTMLElement;

  public currentX = 0;
  public currentY = 0;

  private initX = 0;
  private initY = 0;

  private onMouseDown$: Subscription;
  private onMouseMove$: Subscription;
  private onMouseUp$: Subscription;
  private onMouseEnter$: Subscription;
  private onMouseLeave$: Subscription;

  constructor(
    private elemRef: ElementRef,
    private component: ElementComponent,
    private api: ApiClientSerivce,
    private snack: SnackBarService
  ) {
    this.element = this.elemRef.nativeElement as HTMLElement;
  }

  public getTransformPosition() {
    return this.element.style.transform;
  }

  public setTransformPosition(cords: { x: number, y: number }) {
    this.currentX = cords.x;
    this.currentY = cords.y;
    this.element.style.transform =
      `translate3d(${this.currentX}px,${this.currentY}px, 0)`;
  }

  public resetTransformPosition() {
    this.initX = 0;
    this.initY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.element.style.transform = `translate3d(${this.initX}px,${this.initY}px, 0)`;
  }

  public showElement() {
    this.element.classList.add('move-state');
    setTimeout(() => {
      this.element.classList.remove('move-state');
    }, 1000);
  }

  ngOnInit() {
    this.onMouseDown$ = fromEvent<MouseEvent>(this.element, 'mousedown')
      .subscribe((event$: MouseEvent) => {
        const element = this.element.firstElementChild as HTMLElement;
        const boundGrid = document.getElementById(element.className) as HTMLElement;

        const minBoundX = (boundGrid.offsetParent as HTMLElement).offsetLeft;
        const minBoundY = (boundGrid.offsetParent as HTMLElement).offsetTop;

        const maxBoundX = minBoundX + boundGrid.offsetWidth -
          element.offsetWidth;
        const maxBoundY = minBoundY + boundGrid.offsetHeight -
          element.offsetHeight;

        this.initX = event$.clientX - this.currentX;
        this.initY = event$.clientY - this.currentY;

        this.element.classList.add('move-state');

        this.onMouseMove$ = fromEvent<MouseEvent>(this.element, 'mousemove').pipe(
          takeUntil(fromEvent<MouseEvent>(this.element, 'mouseup')))
          .subscribe((event$: MouseEvent) => {
            event$.preventDefault();

            const x = event$.clientX - this.initX;
            const y = event$.clientY - this.initY;

            this.currentX = Math.max(minBoundX, Math.min(x, maxBoundX));
            this.currentY = Math.max(minBoundY, Math.min(y, maxBoundY));

            this.element.style.transform =
              `translate3d(${this.currentX}px,${this.currentY}px, 0)`;
          });
      });

    this.onMouseUp$ = fromEvent<MouseEvent>(this.element, 'mouseup')
      .subscribe(() => {
        this.initX = this.currentX;
        this.initY = this.currentY;

        this.element.classList.remove('move-state');

        this.api.postElementById(this.component).subscribe(() => {
          this.snack.open("Saved!");
        });

        if(this.onMouseMove$)
          this.onMouseMove$.unsubscribe();
      });

    this.onMouseEnter$ = fromEvent<MouseEvent>(this.element, 'mouseenter')
      .subscribe(() => {
        this.element.classList.add('move-state');
      });

    this.onMouseLeave$ = fromEvent<MouseEvent>(this.element, 'mouseleave')
      .subscribe(() => {
        this.element.classList.remove('move-state');
      });
  }

  ngOnDestroy() {
    this.onMouseDown$.unsubscribe();
    this.onMouseMove$.unsubscribe();
    this.onMouseUp$.unsubscribe();
    this.onMouseEnter$.unsubscribe();
    this.onMouseLeave$.unsubscribe();
  }
}
