import { Element } from "@renderer/models/element";

export interface IMessage {
  type: WebSocketType;
  element?: Element;
  status?: number;
}

export enum WebSocketType {
  GetAll = 'get-all',
  Create = 'create',
  Update = 'update',
  Delete = 'delete'
}
