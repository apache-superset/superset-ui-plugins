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
import * as color from 'd3-color';
import { getNumberFormatter, NumberFormats } from '@superset-ui/number-format';
import { ChartProps } from '@superset-ui/chart';
import getTimeFormatterForGranularity from '../utils/getTimeFormatterForGranularity';

const TIME_COLUMN = '__timestamp';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queryData } = chartProps;
  const {
    colorPicker,
    compareLag: compareLagInput,
    compareSuffix = '',
    headerFontSize,
    metric,
    showTrendLine,
    startYAxisAtZero,
    subheader = '',
    subheaderFontSize,
    timeGrainSqla: granularity,
    vizType,
    timeRangeFixed = false,
    timeRangeUseFallback = false,
  } = formData;
  let { yAxisFormat } = formData;
  const { data, from_dttm: fromDatetime, to_dttm: toDatetime } = queryData;
  const metricName = metric?.label ? metric.label : metric;
  const compareLag = Number(compareLagInput) || 0;
  const supportTrendLine = vizType === 'big_number';
  const supportAndShowTrendLine = supportTrendLine && showTrendLine;
  let formattedSubheader = subheader;

  let mainColor;
  if (colorPicker) {
    const { r, g, b } = colorPicker;
    mainColor = color.rgb(r, g, b).hex();
  }

  let bigNumber = null;
  let trendLineData = null;
  let percentChange = 0;

  bigNumber = data.length === 0 ? null : data[0][metricName];

  if (data.length > 0) {
    const sortedData = [...data]
      .map(d => ({ x: d[TIME_COLUMN], y: d[metricName] }))
      .sort((a, b) => b.x - a.x); // sort in time descending order

    bigNumber = sortedData[0].y;
    if (bigNumber === null && timeRangeUseFallback) {
      const lastAvailable = sortedData.find(d => d.y !== null);
      bigNumber = lastAvailable ? lastAvailable.y : null;
    }

    if (compareLag > 0) {
      const compareIndex = compareLag;
      if (compareIndex < sortedData.length) {
        const compareValue = sortedData[compareIndex].y;
        percentChange =
          compareValue === 0 ? 0 : (bigNumber - compareValue) / Math.abs(compareValue);
        const formatPercentChange = getNumberFormatter(NumberFormats.PERCENT_SIGNED_1_POINT);
        formattedSubheader = `${formatPercentChange(percentChange)} ${compareSuffix}`;
      }
    }

    if (supportTrendLine) {
      // sortedData.reverse(); // no need to reverse because the chart sort by x again anyway
      trendLineData = supportAndShowTrendLine ? sortedData : null;
    }
  }

  let className = '';
  if (percentChange > 0) {
    className = 'positive';
  } else if (percentChange < 0) {
    className = 'negative';
  }

  if (!yAxisFormat && chartProps.datasource && chartProps.datasource.metrics) {
    chartProps.datasource.metrics.forEach(
      // eslint-disable-next-line camelcase
      (metricEntry: { metric_name?: string; d3format: string }) => {
        if (metricEntry.metric_name === metric && metricEntry.d3format) {
          yAxisFormat = metricEntry.d3format;
        }
      },
    );
  }

  const formatNumber = getNumberFormatter(yAxisFormat);
  const formatTime = getTimeFormatterForGranularity(granularity);

  return {
    width,
    height,
    bigNumber,
    className,
    formatNumber,
    formatTime,
    headerFontSize,
    subheaderFontSize,
    mainColor,
    showTrendLine: supportAndShowTrendLine,
    startYAxisAtZero,
    subheader: formattedSubheader,
    trendLineData,
    fromDatetime,
    toDatetime,
    timeRangeUseFallback,
    timeRangeFixed,
  };
}
