import { Directive, ElementRef, HostListener,
         OnDestroy } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: '.element',
  exportAs: 'appElement'
})
export class ElementDirective implements OnDestroy{
  private element: HTMLElement;

  constructor(
    private elemRef: ElementRef,
  ) {
    this.element = this.elemRef.nativeElement as HTMLElement;
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

    const realElem = this.element.firstElementChild as HTMLElement;
    const bound = document.getElementById(realElem.className) as HTMLElement;

    const minBoundX = (bound.offsetParent as HTMLElement).offsetLeft;
    const minBoundY = (bound.offsetParent as HTMLElement).offsetTop;

    const maxBoundX = minBoundX + bound.offsetWidth -
      realElem.offsetWidth;
    const maxBoundY = minBoundY + bound.offsetHeight -
      realElem.offsetHeight;

    this.initX = event.clientX - this.currentX;
    this.initY = event.clientY - this.currentY;

    this.element.classList.add('move-state');

    const scale = Math.min(realElem.offsetWidth/maxBoundX,
                           realElem.offsetHeight/maxBoundY);

    this.moveEvent = move.subscribe((event: MouseEvent) => {
      event.preventDefault();

      const x = event.clientX - this.initX;
      const y = event.clientY - this.initY;

      this.currentX = Math.max(minBoundX, Math.min(x, maxBoundX));
      this.currentY = Math.max(minBoundY, Math.min(y, maxBoundY));

      this.element.style.transform = `translate3d(${this.currentX}px,${this.currentY}px, 0)`;
   });
  }

  private getScale() {
    const realElem = this.element.firstElementChild as HTMLElement;
    const bound = document.getElementById(realElem.className) as HTMLElement;

    const minBoundX = (bound.offsetParent as HTMLElement).offsetLeft;
    const minBoundY = (bound.offsetParent as HTMLElement).offsetTop;

    const maxBoundX = minBoundX + bound.offsetWidth -
      realElem.offsetWidth;
    const maxBoundY = minBoundY + bound.offsetHeight -
      realElem.offsetHeight;

    return Math.min(realElem.offsetWidth / maxBoundX,
                    realElem.offsetHeight / maxBoundY);
  }

  private lastWindowX: number;
  private lastWindowY: number;

  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    clearTimeout();

    const scale = this.getScale();

    if (window.innerWidth < this.lastWindowX) {
      this.currentX -= scale;
    } else if (window.innerWidth > this.lastWindowX) {
      this.currentX += scale;
    }

    if (window.innerHeight < this.lastWindowY) {
      this.currentY -= scale;
    } else if (window.innerHeight > this.lastWindowY) {
      this.currentY += scale;
    }

    this.element.style.transform =
      `translate3d(${this.currentX}px,${this.currentY}px, 0)`;

    // Capture last window position.
    setTimeout(() => {
      this.lastWindowX = window.innerWidth;
      this.lastWindowY = window.innerHeight;
    }, 250);
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
