export type PlainObject<Key extends string = string, Value extends any = any> = {
  [key in Key]: Value
};

export type Dataset<T extends string = string> = {
  keys: T[];
  values: Partial<PlainObject<T>>[];
};

export function verifyDataset<T extends string>(input: Dataset<T>): Dataset<T> {
  return input;
}
