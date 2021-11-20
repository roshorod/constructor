import { ElementAction, Element } from "./element";

function elementRect(element: any): DOMRect {
  return element.getBoundingClientRect();
}

export function getElementAction(
  event: MouseEvent,
  element: Element,
  mouseOffset: number
): ElementAction {

  const rect = elementRect(event.target);

  const left = event.clientX - rect.left;
  const right = rect.right - event.clientX;
  const top = event.clientY - rect.top;
  const bottom = rect.bottom - event.clientY;

  if (
    left >= 0 &&
    left < mouseOffset &&
    top >= 0 &&
    top < mouseOffset &&
    (element.resizeLeft ?? true) &&
    (element.resizeTop ?? true)
  )
    return ElementAction.left_top;
  else if (
    left >= 0 &&
    left < mouseOffset &&
    bottom >= 0 &&
    bottom < mouseOffset &&
    (element.resizeLeft ?? true) &&
    (element.resizeBottom ?? true))
    return ElementAction.left_bottom;
  else if (
    right >= 0 &&
    right < mouseOffset &&
    top >= 0 &&
    top < mouseOffset &&
    (element.resizeRight ?? true) &&
    (element.resizeTop ?? true))
    return ElementAction.right_top;
  else if (right >= 0 &&
    right < mouseOffset &&
    bottom >= 0 &&
    bottom < mouseOffset &&
    (element.resizeRight ?? true) &&
    (element.resizeBottom ?? true))
    return ElementAction.right_bottom;
  else if (
    left >= 0 &&
    left < mouseOffset &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom &&
    (element.resizeLeft ?? true))
    return ElementAction.left;
  else if (
    right >= 0 &&
    right < mouseOffset &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom &&
    (element.resizeRight ?? true))
    return ElementAction.right;
  else if (
    top >= 0 &&
    top < mouseOffset &&
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    (element.resizeTop ?? true))
    return ElementAction.top;
  else if (
    bottom >= 0 &&
    bottom < mouseOffset &&
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    (element.resizeBottom ?? true))
    return ElementAction.bottom;
  else if (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom)
    return ElementAction.move;
  else
    return ElementAction.none;
  }
