import { DOCUMENT } from "@angular/common";

import { Directive, ElementRef, HostListener, Inject,
         OnDestroy } from "@angular/core";

import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: '.element',
  exportAs: 'appElement'
})
export class ElementDirective implements OnDestroy{
  private element: HTMLElement;
  private renderer: HTMLElement;

  constructor(
    private elemRef: ElementRef,
    @Inject(DOCUMENT) document: Document
  ) {
    this.element = this.elemRef.nativeElement as HTMLElement;
    this.renderer = document.getElementById("app-renderer") as HTMLElement;
  }

  ngOnDestroy() {
    (this.moveEvent as Subscription).unsubscribe();
  }

  getTransformPosition() {
    return this.element.style.transform;
  }

  resetPosition() {
    this.initX = 0;
    this.initY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.element.style.transform = `translate3d(${this.initX}px,${this.initY}px, 0)`;
  }

  showElement() {
    this.element.classList.add('move-state');
    setTimeout(() => {
      this.element.classList.remove('move-state');
    }, 1000);
  }

  private moveEvent: Subscription;

  private initX = 0;
  private initY = 0;
  private currentX = 0;
  private currentY = 0;

  @HostListener('mousedown', ['$event'])
  private onMoveStart(event: MouseEvent) {
    const move = fromEvent<MouseEvent>(this.element, 'mousemove').pipe(
      takeUntil(fromEvent<MouseEvent>(this.element, 'mouseup')));

    //Change this on window resize
    const minBoundX = (this.renderer.offsetParent) as HTMLElement;
    const minBoundY = (this.renderer.offsetParent) as HTMLElement;

    const maxBoundX = minBoundX.offsetLeft + this.renderer.offsetWidth -
      this.element.offsetWidth;
    const maxBoundY = minBoundY.offsetTop + this.renderer.offsetHeight -
      this.element.offsetHeight;

    //Change this on window resize
    this.initX = event.clientX - this.currentX;
    this.initY = event.clientY - this.currentY;

    this.element.classList.add('move-state');

    this.moveEvent = move.subscribe((event: MouseEvent) => {
      event.preventDefault();

      //Need change initX when enter on other grid
      //Think need reset all calculation, and somehow save borders
      const x = event.clientX - this.initX;
      const y = event.clientY - this.initY;

      // console.log("x: ", x)
      // console.log("y: ", y)

      this.currentX = Math.max(minBoundX.offsetLeft, Math.min(x, maxBoundX));
      this.currentY = Math.max(minBoundY.offsetTop, Math.min(y, maxBoundY));

      // console.log("currentX: ", this.currentX)
      // console.log("currentY: ", this.currentY)

      this.element.style.transform = `translate3d(${this.currentX}px,${this.currentY}px, 0)`;
    });
  }

  @HostListener('mouseup', ['$event'])
  private onMoveStop(event: MouseEvent) {
    this.initX = this.currentX;
    this.initY = this.currentY;

    this.element.classList.remove('move-state');

    if (this.moveEvent)
      this.moveEvent.unsubscribe();
  }

  @HostListener('mouseenter')
  private onMouseEnter() {
    this.element.classList.add('move-state');
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.element.classList.remove('move-state');
  }

  @HostListener('document:keydown.escape', ['$event'])
  private onEscapeKeydown(event: KeyboardEvent) {
    this.element.classList.remove('move-state');
  }
}
