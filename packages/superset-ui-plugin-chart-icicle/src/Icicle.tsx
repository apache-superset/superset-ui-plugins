import React, { PureComponent } from 'react';
import { IcicleNode } from '../types/IcicleNode';
import { default as IciclePath } from './IciclePath';
import { HierarchyRectangularNode } from 'd3-hierarchy';

type Props = {
  className?: string;
  width: number;
  height: number;
  data: IcicleNode;
  boxMargin: {
    x: number;
    y: number;
  };
  color: (name: string) => string;
  contentRenderer: () => void;
  isVertical: boolean;
  rounding: number;
  transitionDuration: number;
};

export default class IcicleChart extends PureComponent<Props> {
  private chartRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
  }

  // Creates a d3 hierarchy to a partition, to a layout to use to render the chart
  createPartitionAndLayout(data: IcicleNode, height: number, width: number) {}

  // Given an id of an IcicleNode, update zoom path & zoom in/out of icicle chart as needed
  setFocusById(id: string) {}

  // Focus on the node that was clicked, change x, y coordinates of icicles to zoom chart
  onClick(clickedNode: HierarchyRectangularNode<IcicleNode>) {}

  render() {
    return (
      <div>
        <IciclePath />
        <div ref={this.chartRef}>Icicle Chart</div>
      </div>
    );
  }
}
