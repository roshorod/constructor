import { Element } from "@renderer/models/element";
import { StoreService } from "@services/store.service";
import { Handler } from "../handler.interface";

export function onEnd(event: MouseEvent, element: Element, store: StoreService, handlers: Handler) {
  store.update(element).subscribe();

  if (element.id)
    store.recive(element.id).subscribe((element) => {
      store.select(element);
    });
  else
    console.error("Can't sync element with server. It don't have id");

  document.removeEventListener(
    handlers.onMove.type,
    handlers.onMove.callback,
    true
  );

  document.removeEventListener(
    handlers.onResize.type,
    handlers.onResize.callback,
    true
  );

  document.removeEventListener(
    handlers.onEnd.type,
    handlers.onEnd.callback,
    true
  );
}
