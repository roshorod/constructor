export declare type Action =
  | { action: 'select' }
  | { action: 'create' }
  | { action: 'update', target: 'element' }
  | { action: 'update', target: 'position' };
