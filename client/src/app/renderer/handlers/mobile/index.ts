import { inject, InjectionToken } from "@angular/core";
import { StoreService } from "@services/store.service";
import { Handler } from "../handler.interface";
import { Element } from "@renderer/models/element";
import { GridProps } from "@renderer/components/grid/grid.props";
import { GridPropsService } from "@renderer/components/grid/grid.props-service";

import { onResize } from "./on-resize";
import { onMove } from "./on-move";
import { onEnd } from "./on-end";

export const MOBILE = new InjectionToken<Handler>(
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

      inject(GridPropsService).gridProps$.subscribe((props) => {
        if (props)
          gProps = props;
        else
          console.warn("Chosen gridProps undefined");
      });

      const handlers = {
        onResize: {
          type: 'touchmove',
          callback: (event: Event) => onResize(<TouchEvent>event, element, gProps)
        },
        onMove: {
          type: 'touchmove',
          callback: async (event: Event) => onMove(<TouchEvent>event, element, gProps)
        },
        onEnd: {
          type: 'touchend',
          callback: (event: Event) => onEnd(<TouchEvent>event, element, store, handlers)
        }
      };

      return handlers;
    }
  });
