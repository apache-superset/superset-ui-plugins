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
import PropTypes from 'prop-types';
import React from 'react';
import {
  AreaSeries,
  LinearGradient,
  LineSeries,
  XYChart,
  CrossHair,
  WithTooltip,
} from '@data-ui/xy-chart';
import { themeShape } from '@data-ui/xy-chart/esm/utils/propShapes';
import { chartTheme } from '@data-ui/theme';
import { groupBy, flatMap, uniqueId, values } from 'lodash';
import createTooltip from './createTooltip';
import renderLegend from '../utils/renderLegend';
import XYChartLayout from '../utils/XYChartLayout';
import WithLegend from '../components/WithLegend';
import Encoder from '../utils/Encoder';

chartTheme.gridStyles.stroke = '#f1f3f5';

const propTypes = {
  className: PropTypes.string,
  // data: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.string,
  //     values: PropTypes.arrayOf(
  //       PropTypes.shape({
  //         x: PropTypes.number,
  //         y: PropTypes.number,
  //       }),
  //     ),
  //   }),
  // ).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
  }),
  encoding: PropTypes.shape({
    x: PropTypes.object,
    y: PropTypes.object,
    color: PropTypes.object,
  }).isRequired,
  theme: themeShape,
};

const defaultProps = {
  className: '',
  margin: { top: 20, right: 20, left: 20, bottom: 20 },
  theme: chartTheme,
};

class LineChart extends React.PureComponent {
  renderChart({ width, height }) {
    const { data, encoding, margin, theme } = this.props;

    const fieldNames = data.keys
      .filter(k => k !== encoding.x.field && k !== encoding.y.field)
      .sort((a, b) => a.localeCompare(b));

    const groups = groupBy(data.values, row => fieldNames.map(f => `${f}=${row[f]}`).join(','));

    const allSeries = values(groups).map(seriesData => {
      const firstDatum = seriesData[0];

      const series = {
        key: fieldNames.map(f => firstDatum[f]).join(','),
        color: this.encoder.encode(firstDatum, 'color'),
        fill: this.encoder.encode(firstDatum, 'fill', false),
        strokeDasharray: this.encoder.encode(firstDatum, 'strokeDasharray'),
      };

      series.values = seriesData.map(v => ({
        x: this.encoder.accessors.x(v),
        y: this.encoder.accessors.y(v),
        data: v,
        parent: series,
      }));

      return series;
    });

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

    const spec = {
      width,
      height,
      minContentWidth: 0,
      minContentHeight: 0,
      margin,
      theme,
      encoding,
    };

    const layout = new XYChartLayout({ ...spec, children });

    return layout.createChartWithFrame(dim => (
      <WithTooltip renderTooltip={createTooltip(spec, allSeries)}>
        {({ onMouseLeave, onMouseMove, tooltipData }) => (
          <XYChart
            width={dim.width}
            height={dim.height}
            ariaLabel="BoxPlot"
            margin={layout.margin}
            eventTrigger="container"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            renderTooltip={null}
            showYGrid
            snapTooltipToDataX
            theme={spec.theme}
            tooltipData={tooltipData}
            xScale={spec.encoding.x.scale}
            yScale={spec.encoding.y.scale}
          >
            {children}
            {layout.createXAxis()}
            {layout.createYAxis()}
            <CrossHair
              fullHeight
              strokeDasharray=""
              showHorizontalLine={false}
              circleFill={d => (d.y === tooltipData.datum.y ? d.parent.color : '#fff')}
              circleSize={d => (d.y === tooltipData.datum.y ? 6 : 4)}
              circleStroke={d => (d.y === tooltipData.datum.y ? '#fff' : d.parent.color)}
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

    this.encoder = new Encoder(encoding);

    return (
      <WithLegend
        className={`superset-chart-line ${className}`}
        width={width}
        height={height}
        position="top"
        renderLegend={() => renderLegend(data, this.encoder)}
        renderChart={parent => this.renderChart(parent)}
        hideLegend={!this.encoder.hasLegend()}
      />
    );
  }
}

LineChart.propTypes = propTypes;
LineChart.defaultProps = defaultProps;

export default LineChart;
