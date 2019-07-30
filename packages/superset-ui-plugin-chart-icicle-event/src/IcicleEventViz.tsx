import React, { PureComponent } from 'react';
import { IcicleEventNode } from '../types/IcicleEventNode';

interface Props {
  className?: string;
  width: number;
  height: number;
  data: IcicleEventNode;
  color: (name: string) => string;
  isVertical: boolean;
  rounding: number;
  transitionDuration: number;
}

export default class IcicleEventViz extends PureComponent<Props> {
  render() {
    // TODO: create d3 partition & layout w/ memoization & pass into chart here

    return <div>Icicle Event Chart Component</div>;
  }
}
