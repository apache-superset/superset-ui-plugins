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
    useFixedTimeRange = false,
  } = formData;
  let { yAxisFormat } = formData;
  const { data, from_dttm: fromDatetime, to_dttm: toDatetime } = queryData;
  const metricName = metric?.label ? metric.label : metric;
  const compareLag = Number(compareLagInput) || 0;
  const supportTrendLine = vizType === 'big_number';
  const supportAndShowTrendLine = supportTrendLine && showTrendLine;

  let bigNumber;
  let trendLineData;
  let percentChange = 0;
  let formattedSubheader = subheader;

  let mainColor;
  if (colorPicker) {
    const { r, g, b } = colorPicker;
    mainColor = color.rgb(r, g, b).hex();
  }

  if (supportTrendLine) {
    const sortedData = [...data].sort((a, b) => a[TIME_COLUMN] - b[TIME_COLUMN]);
    bigNumber = sortedData.length === 0 ? null : sortedData[sortedData.length - 1][metricName];
    if (compareLag > 0) {
      const compareIndex = sortedData.length - (compareLag + 1);
      if (compareIndex >= 0) {
        const compareValue = sortedData[compareIndex][metricName];
        percentChange =
          compareValue === 0 ? 0 : (bigNumber - compareValue) / Math.abs(compareValue);
        const formatPercentChange = getNumberFormatter(NumberFormats.PERCENT_SIGNED_1_POINT);
        formattedSubheader = `${formatPercentChange(percentChange)} ${compareSuffix}`;
      }
    }
    trendLineData = supportAndShowTrendLine
      ? sortedData.map(point => ({
          x: point[TIME_COLUMN],
          y: point[metricName],
        }))
      : null;
  } else {
    bigNumber = data.length === 0 ? null : data[0][metricName];
    trendLineData = null;
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
    useFixedTimeRange,
  };
}
