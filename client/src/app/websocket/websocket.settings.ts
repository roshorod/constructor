import { InjectionToken } from "@angular/core";

export const SETTINGS = new InjectionToken('');

export interface WebSocketSettings {
  url: string;

  reconnectInterval?: number;
  recoonectAttempts?: number;
}
