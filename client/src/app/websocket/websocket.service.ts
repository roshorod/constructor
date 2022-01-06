import { Inject, Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { filter, takeUntil, retry, delay } from "rxjs/operators";
import { WebSocketSubject } from "rxjs/webSocket";
import { SETTINGS, WebSocketSettings, IMessage, IResponse } from "@websocket";
import { CookiesService } from "@services/cookie.service";
import { WebSocketType } from "./messages/IMessage";
import { LifetimeService } from "@services/lifetime.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private connection$: WebSocketSubject<any>;

  private connectionStream$ = new Subject<IResponse>();

  public isConnected$ = new BehaviorSubject<boolean>(false);

  constructor(
    cookieService: CookiesService,
    private lifetime$: LifetimeService,
    @Inject(SETTINGS) private settings: WebSocketSettings
  ) {
    const session = cookieService.cookie;

    this.connection$ = new WebSocketSubject({
      url: settings.url,
      serializer: msg => JSON.stringify({ ...msg, session }),
      openObserver: {
        next: _ => {
          console.info("Connection established!");

          this.isConnected$.next(true);
        }
      },
      closeObserver: {
        next: _ => {
          console.info("Connection lost!");

          this.isConnected$.next(false);
        }
      }
    });

    this.connection$.pipe(takeUntil(this.lifetime$));

    this.connect();
  }

  private connect() {
    this.connection$.subscribe({
      next: (message) => this.connectionStream$.next(message),
      error: (error) => {
        if (!this.connection$) {
          console.error("WebSocket error ", error);
        }
      }
    });

    this.isConnected$
      .pipe(
        filter(val => val == false),
        delay(<number>this.settings.reconnectInterval),
        retry(this.settings.recoonectAttempts)
      )
      .subscribe(() => {
        this.connection$
          .subscribe((message) => this.connectionStream$.next(message))
      });
  }

  public consume(): Observable<IResponse> {
    return this.connectionStream$.asObservable()
      .pipe(takeUntil(this.lifetime$));
  }

  public consumeWithType(type: WebSocketType): Observable<IResponse> {
    return this.consume()
      .pipe(
        filter((message: IResponse) => message.type == type)
      );
  }

  public put(message: IMessage) {
    this.connection$.next(message);
  }
}
