export interface PlainObject {
  [key: string]: any;
}

export interface Dataset {
  keys: string[];
  values: PlainObject[];
}
