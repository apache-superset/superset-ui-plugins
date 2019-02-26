/* eslint-disable sort-keys, no-magic-numbers */

import React from 'react';
import collectScalesFromProps from '@data-ui/xy-chart/esm/utils/collectScalesFromProps';
import { XAxis, YAxis } from '@data-ui/xy-chart';
import { ChartTheme } from '@data-ui/theme';
import { Margin, mergeMargin } from '@superset-ui/dimension';
import computeXAxisLayout from './computeXAxisLayout';
import computeYAxisLayout from './computeYAxisLayout';
import createTickComponent from './createTickComponent';
import getTickLabels from './getTickLabels';
import ChartFrame from '../components/ChartFrame';
import ChannelEncoder from '../encodeable/ChannelEncoder';
import { XFieldDef, YFieldDef } from '../encodeable/types/FieldDef';
import { XAxis as XAxisConfig } from '../encodeable/types/Axis';
import { PlainObject } from '../encodeable/types/Data';

// Additional margin to avoid content hidden behind scroll bar
const OVERFLOW_MARGIN = 8;

interface Input {
  width: number;
  height: number;
  minContentWidth?: number;
  minContentHeight?: number;
  margin: Margin;
  xEncoder: ChannelEncoder<XFieldDef>;
  yEncoder: ChannelEncoder<YFieldDef>;
  children: React.ReactElement[];
  theme: ChartTheme;
}

export default class XYChartLayout {
  chartWidth: number;
  chartHeight: number;
  containerWidth: number;
  containerHeight: number;
  margin: Margin;
  spec: Input;

  xLayout?: {
    labelOffset: number;
    labellingStrategy: string;
    rotation?: number;
    tickTextAnchor?: string;
    minMargin: Partial<Margin>;
    orientation: string;
  };

  yLayout?: {
    labelOffset: number;
    minMargin: Partial<Margin>;
    orientation: string;
  };

  // eslint-disable-next-line complexity
  constructor(spec: Input) {
    this.spec = spec;

    const {
      width,
      height,
      minContentWidth = 0,
      minContentHeight = 0,
      margin,
      xEncoder,
      yEncoder,
      children,
      theme,
    } = spec;

    const { xScale, yScale } = collectScalesFromProps({
      width,
      height,
      margin,
      xScale: xEncoder.definition.scale || {},
      yScale: yEncoder.definition.scale || {},
      theme,
      children,
    });

    if (typeof yEncoder.axis !== 'undefined') {
      const { axis: yAxis } = yEncoder;
      this.yLayout = computeYAxisLayout({
        orientation: yAxis.config.orient,
        tickLabels: yAxis.getTickLabels(yScale),
        tickLength: theme.yTickStyles.length,
        tickTextStyle: theme.yTickStyles.label.right,
      });
    }

    const secondMargin = this.yLayout ? mergeMargin(margin, this.yLayout.minMargin) : margin;
    const innerWidth = Math.max(width - secondMargin.left - secondMargin.right, minContentWidth);

    if (typeof xEncoder.axis !== 'undefined') {
      const { axis: xAxis } = xEncoder;
      const config = xAxis.config as XAxisConfig;
      this.xLayout = computeXAxisLayout({
        axisWidth: innerWidth,
        orientation: config.orient || 'bottom',
        labelAngle: config.labelAngle || this.recommendLabelAngle(config.orient),
        tickLabels: xAxis.getTickLabels(xScale),
        tickLength: theme.xTickStyles.length,
        tickTextStyle: theme.xTickStyles.label.bottom,
      });
    }

    const finalMargin = this.xLayout
      ? mergeMargin(secondMargin, this.xLayout.minMargin)
      : secondMargin;
    const innerHeight = Math.max(height - finalMargin.top - finalMargin.bottom, minContentHeight);

    const chartWidth = Math.round(innerWidth + finalMargin.left + finalMargin.right);
    const chartHeight = Math.round(innerHeight + finalMargin.top + finalMargin.bottom);

    const isOverFlowX = chartWidth > width;
    const isOverFlowY = chartHeight > height;
    if (isOverFlowX) {
      finalMargin.bottom += OVERFLOW_MARGIN;
    }
    if (isOverFlowY) {
      finalMargin.right += OVERFLOW_MARGIN;
    }
    this.chartWidth = isOverFlowX ? chartWidth + OVERFLOW_MARGIN : chartWidth;
    this.chartHeight = isOverFlowY ? chartHeight + OVERFLOW_MARGIN : chartHeight;
    this.containerWidth = width;
    this.containerHeight = height;
    this.margin = finalMargin;
  }

  recommendLabelAngle(xOrientation: 'top' | 'bottom' = 'bottom') {
    if (!this.yLayout) {
      return 40;
    }

    return (this.yLayout.orientation === 'right' && xOrientation === 'bottom') ||
      (this.yLayout.orientation === 'left' && xOrientation === 'top')
      ? 40
      : -40;
  }

  createChartWithFrame(renderChart: (input: { width: number; height: number }) => React.ReactNode) {
    return (
      <ChartFrame
        width={this.containerWidth}
        height={this.containerHeight}
        contentWidth={this.chartWidth}
        contentHeight={this.chartHeight}
        renderContent={renderChart}
      />
    );
  }

  createXAxis(props?: PlainObject) {
    const { axis } = this.spec.xEncoder;

    return axis && this.xLayout ? (
      <XAxis
        label={axis.getTitle()}
        labelOffset={this.xLayout.labelOffset}
        numTicks={axis.config.tickCount}
        orientation={this.xLayout.orientation}
        tickComponent={createTickComponent(this.xLayout)}
        tickFormat={axis.getFormat()}
        {...props}
      />
    ) : null;
  }

  createYAxis(props?: PlainObject) {
    const { axis } = this.spec.yEncoder;

    return axis && this.yLayout ? (
      <YAxis
        label={axis.getTitle()}
        labelOffset={this.yLayout.labelOffset}
        numTicks={axis.config.tickCount}
        orientation={this.yLayout.orientation}
        tickFormat={axis.getFormat()}
        {...props}
      />
    ) : null;
  }
}
