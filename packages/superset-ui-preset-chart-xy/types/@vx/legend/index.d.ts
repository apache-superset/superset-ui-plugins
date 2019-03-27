/* eslint-disable react/no-multi-comp */
declare module '@vx/legend' {
  import { ReactNode } from 'react';

  export function LegendOrdinal(props: { [key: string]: any }): ReactNode;

  export function LegendItem(props: { [key: string]: any }): ReactNode;

  export function LegendLabel(props: {
    align: string;
    label?: ReactNode;
    flex?: string | number;
    margin?: string | number;
    children?: ReactNode;
  }): ReactNode;
}
