import { CommonModule } from "@angular/common";
import { Injector, ModuleWithProviders, NgModule } from "@angular/core";
import { SETTINGS, WebSocketSettings } from "@websocket";
import { WebSocketService } from "./websocket.service";

@NgModule({
  imports: [CommonModule],
})
export class WebSocketModule {
  public static WebSocketService: WebSocketService;

  constructor(injector: Injector) {
    WebSocketModule.WebSocketService = injector.get<WebSocketService>(WebSocketService);
  }

  public static configure(wsConfig: WebSocketSettings)
    : ModuleWithProviders<WebSocketModule> {
    return {
      ngModule: WebSocketModule,
      providers: [{ provide: SETTINGS, useValue: wsConfig }]
    };
  }
}
