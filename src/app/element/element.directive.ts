import { DOCUMENT } from "@angular/common";

import { Directive, ElementRef, HostBinding, Inject,
         OnDestroy, OnInit } from "@angular/core";

import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  // selector: '[appElement]'
  selector: '.element'
})
export class ElementDirective implements OnInit, OnDestroy{

  private element: HTMLElement;
  private subscriptions: Subscription[] = [];

  // Help make bounds for renderer.component
  private renderer: HTMLElement;

  constructor(
    private elemRef: ElementRef,
    @Inject(DOCUMENT) document: Document) {
    this.element = this.elemRef.nativeElement as HTMLElement;
    this.renderer = document.getElementById("app-renderer") as HTMLElement;
  }

  ngOnInit() {
    this.handleMoving();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  private handleMoving() {
    const moveStart$ = fromEvent<MouseEvent>(this.element, "mousedown");
    const moveEnd$ = fromEvent<MouseEvent>(this.element, "mouseup");

    const move$ = fromEvent<MouseEvent>(this.element, "mousemove").pipe(
      takeUntil(moveEnd$)
    );

    let initX: number;
    let initY: number;

    let currentX = 0;
    let currentY = 0;

    const minBoundX = (this.renderer.offsetParent) as HTMLElement;
    // const minBoundY = (this.renderer.offsetParent) as HTMLElement;

    const maxBoundX = minBoundX.offsetLeft + this.renderer.offsetWidth - this.element.offsetWidth;
    // const maxBoundY = minBoundY.offsetTop + this.renderer.offsetHeight - this.element.offsetHeight;

    let movingRegister: Subscription;

    const moveStartRegister = moveStart$.subscribe((event: MouseEvent) => {
      initX = event.clientX - currentX;
      initY = event.clientY - currentY;

      this.element.classList.add('move-state');

      movingRegister = move$.subscribe((event: MouseEvent) => {
        event.preventDefault();

        const x = event.clientX - initX;
        const y = event.clientY - initY;

        currentX = Math.max(minBoundX.offsetLeft, Math.min(x, maxBoundX));
        currentY = y;

        this.element.style.transform = `translate3d(${currentX}px,${currentY}px, 0)`;
      });
    });

    const moveStopRegister = moveEnd$.subscribe(() => {
      initX = currentX;
      initY = currentY;

      this.element.classList.remove('move-state');

      if (movingRegister)
        movingRegister.unsubscribe();
    });

    this.subscriptions.push.apply(this.subscriptions, [
      moveStartRegister,
      moveStopRegister,
    ]);
  }
}
