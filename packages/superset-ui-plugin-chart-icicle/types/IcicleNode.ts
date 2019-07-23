export type IcicleNode = {
  id: string;
  event: string;
  name?: string;
  value: number;
  children?: [IcicleNode]
}
