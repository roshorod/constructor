import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Settings } from '@renderer/models/settings'
import { CONFIG } from "./settings.config";

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends BehaviorSubject<Settings> {
  public settings$ = this.asObservable();

  constructor(
    @Inject(CONFIG) settings: Settings,
  ) {
    super(settings);
  }

  public  update(settings: Settings) {
    this.next(settings);

    return this.settings$;
  }
}
