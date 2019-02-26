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
import isEnabled from '../encodeable/utils/isEnabled';
import ChannelEncoder from '../encodeable/ChannelEncoder';
import { XFieldDef, YFieldDef } from '../encodeable/types/fielddef';
import { PlainObject } from '../encodeable/types/data';

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
      xScale: xEncoder.definition.scale,
      yScale: yEncoder.definition.scale,
      theme,
      children,
    });

    const { axis: yAxis } = yEncoder.definition;
    if (isEnabled(yAxis)) {
      this.yLayout = computeYAxisLayout({
        orientation: yAxis.orient,
        tickLabels: getTickLabels(yScale, yAxis),
        tickLength: theme.yTickStyles.length,
        tickTextStyle: theme.yTickStyles.label.right,
      });
    }

    const secondMargin = this.yLayout ? mergeMargin(margin, this.yLayout.minMargin) : margin;
    const innerWidth = Math.max(width - secondMargin.left - secondMargin.right, minContentWidth);

    const { axis: xAxis } = xEncoder.definition;
    if (isEnabled(xAxis)) {
      this.xLayout = computeXAxisLayout({
        axisWidth: innerWidth,
        orientation: xAxis.orient || 'bottom',
        labelAngle: xAxis.labelAngle || this.recommendLabelAngle(xAxis.orient),
        tickLabels: getTickLabels(xScale, xAxis),
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
        contentWidth={this.containerWidth}
        contentHeight={this.containerHeight}
        renderContent={renderChart}
      />
    );
  }

  createXAxis(props?: PlainObject) {
    const { axis = {} } = this.spec.xEncoder;

    return this.xLayout ? (
      <XAxis
        label={axis.label}
        labelOffset={this.xLayout.labelOffset}
        numTicks={axis.tickCount}
        orientation={this.xLayout.orientation}
        tickComponent={createTickComponent(this.xLayout)}
        tickFormat={axis.tickFormat}
        {...props}
      />
    ) : null;
  }

  createYAxis(props?: PlainObject) {
    const { axis = {} } = this.spec.yEncoder;

    return this.yLayout ? (
      <YAxis
        label={axis.label}
        labelOffset={this.yLayout.labelOffset}
        numTicks={axis.tickCount}
        orientation={this.yLayout.orientation}
        tickFormat={axis.tickFormat}
        {...props}
      />
    ) : null;
  }
}
