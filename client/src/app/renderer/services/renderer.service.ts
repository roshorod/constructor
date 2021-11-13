import { Injectable } from "@angular/core";
import { Element } from "@renderer/models/element";
import { settings } from "@renderer/models/settings";

@Injectable({
    providedIn: 'root'
})
export class RendererService {
    public settings: settings = {
        rows: 40,
        columns: 60,

        lines: true,
        corners: true,
    };

    public currentElement?: Element;
}
