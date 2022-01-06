import { Element } from "@renderer/models/element";
import { WebSocketType } from "./IMessage";

export interface IResponse {
  status?: number;
  elements?: Array<Element>;
  type?: WebSocketType;
}
