export interface Handler {
  onResize: { type: string, callback: (event: Event) => void };
  onMove: { type: string, callback: (event: Event) => void };
  onEnd: { type: string, callback: (event: Event) => void };
}
