import React, { Component, createRef } from 'react';
import { IcicleEventNode } from '../types/IcicleEventNode';
import { HierarchyRectangularNode } from 'd3-hierarchy';

interface Props {
  className?: string;
  width: number;
  height: number;
  boxMargin: {
    x: number;
    y: number;
  };
  color: (name: string) => string;
  contentRenderer: () => void;
  d3TreeRoot: HierarchyRectangularNode<IcicleEventNode>;
  isVertical: boolean;
  rounding: number;
  transitionDuration: number;
}

export default class IcicleEventChart extends Component<Props> {
  private chartRef = createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this.renderIcicleChart = this.renderIcicleChart.bind(this);
  }

  componentDidMount() {
    this.renderIcicleChart();
  }

  // Check for changed data to rerender the icicle chart
  componentDidUpdate(prevProps: Props) {}

  // Creates chart using svg & chartRef to the div element
  renderIcicleChart() {}

  render() {
    return (
      <div>
        <div ref={this.chartRef} />
      </div>
    );
  }
}
