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
import { BoxPlotSeries, XYChart } from '@data-ui/xy-chart';
import { themeShape } from '@data-ui/xy-chart/esm/utils/propShapes';
import { chartTheme } from '@data-ui/theme';
import createTooltip from './createTooltip';
import renderLegend from '../utils/renderLegend';
import XYChartLayout from '../utils/XYChartLayout';
import WithLegend from '../components/WithLegend';
import Encoder from '../utils/Encoder';

chartTheme.gridStyles.stroke = '#f1f3f5';

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
  isHorizontal: PropTypes.bool,
  theme: themeShape,
};

const defaultProps = {
  className: '',
  margin: { top: 10, right: 10, left: 10, bottom: 10 },
  isHorizontal: false,
  theme: chartTheme,
};

class BoxPlot extends React.PureComponent {
  renderChart({ width, height }) {
    const { data, encoding, margin, theme, isHorizontal } = this.props;

    const spec = {
      width,
      height,
      minContentWidth: 0,
      minContentHeight: 0,
      margin,
      theme,
      encoding: isHorizontal
        ? {
            ...encoding,
            x: { ...encoding.y, axis: { ...encoding.y.axis, orientation: 'bottom' } },
            y: { ...encoding.x, axis: { ...encoding.x.axis, orientation: 'left' } },
          }
        : encoding,
    };

    const children = [
      <BoxPlotSeries
        key={this.encoder.accessors.x}
        animated
        data={
          isHorizontal
            ? data.map(row => ({ ...row, y: this.encoder.accessors.x(row) }))
            : data.map(row => ({ ...row, x: this.encoder.accessors.x(row) }))
        }
        fill={datum => this.encoder.encode(datum, 'color')}
        fillOpacity={0.4}
        stroke={datum => this.encoder.encode(datum, 'color')}
        strokeWidth={1}
        widthRatio={0.6}
        horizontal={isHorizontal}
      />,
    ];

    const layout = new XYChartLayout({ ...spec, children });

    return layout.createChartWithFrame(dim => (
      <XYChart
        width={dim.width}
        height={dim.height}
        ariaLabel="BoxPlot"
        margin={layout.margin}
        renderTooltip={createTooltip(encoding.y.axis.tickFormat)}
        showYGrid
        theme={spec.theme}
        xScale={spec.encoding.x.scale}
        yScale={spec.encoding.y.scale}
      >
        {children}
        {layout.createXAxis()}
        {layout.createYAxis()}
      </XYChart>
    ));
  }

  render() {
    const { className, data, width, height, encoding } = this.props;

    this.encoder = new Encoder(encoding);

    return (
      <WithLegend
        className={`superset-chart-box-plot ${className}`}
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

BoxPlot.propTypes = propTypes;
BoxPlot.defaultProps = defaultProps;

export default BoxPlot;
