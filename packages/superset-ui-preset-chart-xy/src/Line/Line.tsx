/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint-disable sort-keys, no-magic-numbers, complexity */
import React from 'react';
import {
  AreaSeries,
  LinearGradient,
  LineSeries,
  XYChart,
  CrossHair,
  WithTooltip,
} from '@data-ui/xy-chart';
import { chartTheme, ChartTheme } from '@data-ui/theme';
import { Margin, Dimension } from '@superset-ui/dimension';
import { groupBy, flatMap, uniqueId, values } from 'lodash';
import createTooltip from './createTooltip';
import XYChartLayout from '../utils/XYChartLayout';
import WithLegend from '../components/WithLegend';
import Encoder, { Encoding, Outputs } from './Encoder';
import { Dataset, PlainObject } from '../encodeable/types/Data';
import ChartLegend from '../components/ChartLegend';

chartTheme.gridStyles.stroke = '#f1f3f5';

const defaultProps = {
  className: '',
  margin: { top: 20, right: 20, left: 20, bottom: 20 },
  theme: chartTheme,
};

type Props = {
  className?: string;
  width: number;
  height: number;
  margin?: Margin;
  encoding: Encoding;
  data: Dataset;
  theme?: ChartTheme;
} & typeof defaultProps;

export interface Series {
  key: string;
  color: Outputs['color'];
  fill: Outputs['fill'];
  strokeDasharray: Outputs['strokeDasharray'];
  values: SeriesValue[];
}

export interface SeriesValue {
  x: Outputs['x'];
  y: Outputs['y'];
  data: PlainObject;
  parent: Series;
}

class LineChart extends React.PureComponent<Props, {}> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    const { encoding } = this.props;
    this.encoder = new Encoder({ encoding });
  }

  encoder: Encoder;

  renderChart(dim: Dimension) {
    const { width, height } = dim;
    const { data, encoding, margin, theme } = this.props;

    const fieldNames = data.keys
      .filter(k => k !== encoding.x.field && k !== encoding.y.field)
      .sort((a, b) => a.localeCompare(b));

    const groups = groupBy(data.values, row => fieldNames.map(f => `${f}=${row[f]}`).join(','));

    const allSeries = values(groups).map(seriesData => {
      const firstDatum = seriesData[0];

      const series: Series = {
        key: fieldNames.map(f => firstDatum[f]).join(','),
        color: this.encoder.channels.color.encode(firstDatum),
        fill: this.encoder.channels.fill.encode(firstDatum, false),
        strokeDasharray: this.encoder.channels.strokeDasharray.encode(firstDatum),
        values: [],
      };

      series.values = seriesData.map(v => ({
        x: this.encoder.channels.x.encode(v),
        y: this.encoder.channels.y.encode(v),
        data: v,
        parent: series,
      }));

      return series;
    });

    console.log('allSeries', allSeries);

    const children = flatMap(
      allSeries
        .filter(series => series.fill)
        .map(series => {
          const gradientId = uniqueId(`gradient-${series.key}`);

          return [
            <LinearGradient
              key={`${series.key}-gradient`}
              id={gradientId}
              from={series.color}
              to="#fff"
            />,
            <AreaSeries
              key={`${series.key}-fill`}
              data={series.values}
              interpolation="linear"
              fill={`url(#${gradientId})`}
              stroke={series.color}
              strokeWidth={1.5}
            />,
          ];
        }),
    ).concat(
      allSeries.map(series => (
        <LineSeries
          key={series.key}
          seriesKey={series.key}
          animated
          interpolation="linear"
          data={series.values}
          stroke={series.color}
          strokeDasharray={series.strokeDasharray}
          strokeWidth={1.5}
        />
      )),
    );

    const layout = new XYChartLayout({
      width,
      height,
      margin,
      theme,
      xEncoder: this.encoder.channels.x,
      yEncoder: this.encoder.channels.y,
      children,
    });

    return layout.createChartWithFrame((chartDim: Dimension) => (
      <WithTooltip renderTooltip={createTooltip(this.encoder, allSeries)}>
        {({
          onMouseLeave,
          onMouseMove,
          tooltipData,
        }: {
          onMouseLeave: (...args: any[]) => void;
          onMouseMove: (...args: any[]) => void;
          tooltipData: any;
        }) => (
          <XYChart
            width={chartDim.width}
            height={chartDim.height}
            ariaLabel="LineChart"
            eventTrigger="container"
            margin={layout.margin}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            renderTooltip={null}
            showYGrid
            snapTooltipToDataX
            theme={theme}
            tooltipData={tooltipData}
            xScale={this.encoder.channels.x.definition.scale}
            yScale={this.encoder.channels.y.definition.scale}
          >
            {children}
            {layout.createXAxis()}
            {layout.createYAxis()}
            <CrossHair
              fullHeight
              strokeDasharray=""
              showHorizontalLine={false}
              circleFill={(d: SeriesValue) =>
                d.y === tooltipData.datum.y ? d.parent.color : '#fff'
              }
              circleSize={(d: SeriesValue) => (d.y === tooltipData.datum.y ? 6 : 4)}
              circleStroke={(d: SeriesValue) =>
                d.y === tooltipData.datum.y ? '#fff' : d.parent.color
              }
              circleStyles={{ strokeWidth: 1.5 }}
              stroke="#ccc"
              showCircle
              showMultipleCircles
            />
          </XYChart>
        )}
      </WithTooltip>
    ));
  }

  render() {
    const { className, data, width, height, encoding } = this.props;

    this.encoder = new Encoder({ encoding });

    return (
      <WithLegend
        className={`superset-chart-line ${className}`}
        width={width}
        height={height}
        position="top"
        renderLegend={() => (
          // eslint-disable-next-line react/jsx-props-no-multi-spaces
          <ChartLegend<Outputs, Encoding, Encoder> data={data} encoder={this.encoder} />
        )}
        renderChart={parent => this.renderChart(parent)}
        hideLegend={!this.encoder.hasLegend()}
      />
    );
  }
}

export default LineChart;
