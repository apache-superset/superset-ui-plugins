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
/* eslint-disable sort-keys */
import PropTypes from 'prop-types';
import React from 'react';
import { XYChart, LineSeries, CrossHair, BarSeries, XAxis, YAxis } from '@data-ui/xy-chart';
import { chartTheme } from '@data-ui/theme';
import { LegendOrdinal } from '@vx/legend';
import { scaleOrdinal } from '@vx/scale';
import { CategoricalColorNamespace } from '@superset-ui/color';
import WithLegend from './WithLegend';
import './GroupedChart.css';

const propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.number),
    }),
  ).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  colorScheme: PropTypes.string,
  normalized: PropTypes.bool,
  binCount: PropTypes.number,
  opacity: PropTypes.number,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
};
const defaultProps = {
  className: '',
  colorScheme: '',
  normalized: false,
  binCount: 15,
  opacity: 1,
  xAxisLabel: '',
  yAxisLabel: '',
};

class GroupedChart extends React.PureComponent {
  render() {
    const {
      className,
      data,
      width,
      height,
      binCount,
      colorScheme,
      normalized,
      opacity,
      xAxisLabel,
      yAxisLabel,
    } = this.props;

    const colorFn = CategoricalColorNamespace.getScale(colorScheme);
    const keys = data.map(d => d.key);
    const colorScale = scaleOrdinal({
      domain: keys,
      range: keys.map(colorFn),
    });

    return (
      <WithLegend
        className={`superset-legacy-grouped-chart ${className}`}
        width={width}
        height={height}
        position="top"
        renderLegend={({ direction }) => (
          <LegendOrdinal
            scale={colorScale}
            direction={direction}
            shape="rect"
            labelMargin="0 15px 0 0"
          />
        )}
        renderChart={parent => (
          <XYChart
            width={parent.width}
            height={parent.height}
            xScale={{ type: 'band', paddingInner: 0.15 }}
            yScale={{ type: 'linear' }}
            ariaLabel="Grouped Chart"
            normalized={normalized}
            binCount={binCount}
            binType="numeric"
            margin={{ top: 20, right: 20 }}
            renderTooltip={({ event, datum, data, color }) => (
              <div>
                <strong style={{ color }}>{datum.label}</strong>
                <div>
                  <strong>x </strong>
                  {datum.x}
                </div>
                <div>
                  <strong>y </strong>
                  {datum.y}
                </div>
              </div>
            )}
            valueAccessor={datum => datum}
            theme={chartTheme}
          >
            {data.map(series => (series.renderas === "bar" ? (
              <BarSeries
              key={series.key}
              animated
              data={series.values}
              fill={colorScale(series.key)}
              fillOpacity={opacity}
              />
            ):(
              <LineSeries
              seriesKey={series.key}
              data={series.values}
              stroke={colorScale(series.key)}
              strokeOpacity={opacity}
              />
            )))}
            <XAxis label={xAxisLabel} />
            <YAxis
              label={yAxisLabel}
              orientation="left"
              tickFormat={(tick, tickIndex) => {
                  if (tick >= 1000000000) {
                    return (tick / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                  }
                  if (tick >= 1000000) {
                    return (tick / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                  }
                  if (tick >= 1000) {
                    return (tick / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                  } else {
                    return tick;
                  }
              }} />
            <CrossHair/>
          </XYChart>
        )}
      />
    );
  }
}

GroupedChart.propTypes = propTypes;
GroupedChart.defaultProps = defaultProps;

export default GroupedChart;
