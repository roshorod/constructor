import { WebSocketType } from "@websocket";
import { Observable, of, throwError } from "rxjs";
import { concatMap, tap, switchMap, catchError } from "rxjs/operators";
import { IResponse } from "./messages/IResponse";
import { WebSocketModule } from "./websocket.module";

/**
 * @summary Attach consumed values from websocket by specific type
 */
export function WebSocketAction(props: { action: WebSocketType }) {
  return function(target: any, name: string, descriptor: PropertyDescriptor) {

    const origin = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const funcReturn: Observable<any> = origin.apply(this, args);

      const provider = WebSocketModule.WebSocketService;

      return funcReturn
        .pipe(
          concatMap(() => {
            provider.put({ type: props.action });

            return provider.consumeWithType(props.action)
              .pipe(
                switchMap((resp: IResponse) => {
                  if (resp.status == 500)
                    return throwError('Internal server error');

                  return of(resp);
                }),
                catchError((error: any) => {
                  /*
                   * May be reconnect?
                   */
                  return throwError(error);
                })
              );
          })
        );
    }
  }
}

export function WebSocketPutElement(props: { action: WebSocketType }) {
  return function(target: any, name: string, descriptor: PropertyDescriptor) {

    const origin = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const funcReturn: Observable<any> = origin.apply(this, args);

      const provider = WebSocketModule.WebSocketService;

      return funcReturn
        .pipe(
          concatMap(element => {
            provider.put({ type: props.action, element: element });

            return provider.consumeWithType(props.action)
              .pipe(
                switchMap((resp: IResponse) => {
                  if (resp.status == 500)
                    return throwError('Internal server error');

                  return of(element);
                }),
                catchError((error: any) => {
                  /*
                   * May be reconnect?
                   */
                  return throwError(error);
                }),
              );
          }),
        );
    }
  }
}
