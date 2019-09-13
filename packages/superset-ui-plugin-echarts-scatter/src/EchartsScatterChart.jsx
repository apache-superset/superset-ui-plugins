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
import React from 'react';
import { reactify } from '@superset-ui/chart';
import d3 from 'd3';
import PropTypes from 'prop-types';
import { extent as d3Extent } from 'd3-array';
import echarts from 'echarts';
import './EchartsScatterChart.css';

const propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.arrayOf(PropTypes.string),
      values: PropTypes.arrayOf(
        PropTypes.shape({
          y: PropTypes.number,
        }),
      ),
    }),
  ).isRequired,
};
const defaultProps = {
  className: '',
  width: 800,
  seriesHeight: 20,
  colorScale: 'series',
  mode: 'offset',
  offsetX: 0,
};

function EchartsScatterChart(elem, props) {
  const { width, height, data, xAxisLabel, yAxisLabel } = props;
  elem.style.width = width;
  elem.style.height = height;
  const echart = echarts.init(elem);
  echart.setOption({
    tooltip: {},
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      name: xAxisLabel,
      nameLocation: 'middle',
      nameGap: 20,
      scale: true,
    },
    legend: {
      right: -10,
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      name: yAxisLabel,
      nameLocation: 'middle',
      nameGap: 20,
      scale: true,
    },
    series: data.map(series => ({
      name: series.key,
      type: 'scatter',
      data: series.values.map(d => ({
        label: d.country,
        value: [d.sum__SP_DYN_LE00_IN, d.sum__SP_RUR_TOTL_ZS],
        symbolSize: Math.sqrt(d.sum__SP_POP_TOTL) / 500,
      })),
    })),
  });
}

EchartsScatterChart.propTypes = propTypes;
EchartsScatterChart.defaultProps = defaultProps;

export default reactify(EchartsScatterChart);
