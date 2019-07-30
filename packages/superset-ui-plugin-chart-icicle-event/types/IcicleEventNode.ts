export type IcicleEventNode = {
  id: string;
  event: string;
  name?: string;
  value: number;
  children?: [IcicleEventNode]
}
