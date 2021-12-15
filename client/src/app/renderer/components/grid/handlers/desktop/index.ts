import { inject, InjectionToken } from "@angular/core";
import { StoreService } from "@services/store.service";
import { Handler } from "../handler.interface";
import { Element } from "@renderer/models/element";
import { GridProps } from "@renderer/components/grid/props";

import { onResize } from "./on-resize";
import { onMove } from "./on-move";
import { onEnd } from "./on-end";

export const DESKTOP = new InjectionToken<Handler>(
  "Interaction logic for desktop grid callbacks",
  {
    factory: () => {
      let element: Element;
      let gProps: GridProps;

      /*
       * If subscribe has intresting behavior. Injected only once at injection lifetime
       * If subscribe to this values will be only as undefined even after ViewInit
       * and emiting value in Subject
       */
      const store = inject(StoreService);

      inject(StoreService).chosen$.subscribe((chosen) => {
        if (chosen)
          element = chosen;
      });

      inject(StoreService).gridProps$.subscribe((props) => {
        if (props)
          gProps = props;
        else
          console.warn("Chosen gridProps undefined");
      });

      const handlers = {
        onResize: {
          type: 'mousemove',
          callback: (event: Event) => onResize(<MouseEvent>event, element, gProps)
        },
        onMove: {
          type: 'mousemove',
          callback: (event: Event) => onMove(<MouseEvent>event, element, gProps)
        },
        onEnd: {
          type: 'mouseup',
          callback: (event: Event) => onEnd(<MouseEvent>event, element, store, handlers)
        }
      };

      return handlers;
    }
  });
