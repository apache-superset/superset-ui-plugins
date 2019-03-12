/* eslint-disable react/no-multi-comp */
declare module '@vx/legend' {
  import React from 'react';

  export function LegendOrdinal(props: { [key: string]: any }): React.ReactElement;

  export function LegendItem(props: { [key: string]: any }): React.ReactElement;

  export function LegendLabel(props: {
    align: string;
    label?: React.ReactNode;
    flex?: string | number;
    margin?: string | number;
    children?: React.ReactNode;
  }): React.ReactElement;
}
