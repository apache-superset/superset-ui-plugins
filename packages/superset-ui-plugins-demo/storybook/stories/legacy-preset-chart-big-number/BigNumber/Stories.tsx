/* eslint-disable no-magic-numbers, sort-keys */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import testData from './data';

const TIME_COLUMN = '__timestamp';

const formData = {
  colorPicker: {
    r: 0,
    g: 122,
    b: 135,
    a: 1,
  },
  compareLag: 1,
  compareSuffix: 'over 10Y',
  metric: 'sum__SP_POP_TOTL',
  showTrendLine: true,
  startYAxisAtZero: true,
  vizType: 'big_number',
  yAxisFormat: '.3s',
};

/**
 * Add null values to trendline data
 * @param data input data
 */
function withNulls(origData: object[], nullPosition: number = 3) {
  const data = [...origData];
  data[nullPosition] = {
    ...data[nullPosition],
    sum__SP_POP_TOTL: null,
  };
  return data;
}

export default [
  {
    renderStory: () => (
      <SuperChart
        chartType="big-number"
        width={400}
        height={400}
        queryData={{ data: testData }}
        formData={formData}
      />
    ),
    storyName: 'Basic with Trendline',
    storyPath: 'legacy-|preset-chart-big-number|BigNumberChartPlugin',
  },
  {
    renderStory: () => (
      <SuperChart
        chartType="big-number"
        width={400}
        height={400}
        queryData={{ data: withNulls(testData, 3) }}
        formData={formData}
      />
    ),
    storyName: 'Null in the middle',
    storyPath: 'legacy-|preset-chart-big-number|BigNumberChartPlugin',
  },
  {
    renderStory: () => (
      <SuperChart
        chartType="big-number"
        width={400}
        height={400}
        queryData={{
          data: testData.slice(0, 9),
          from_dttm: testData[testData.length - 1][TIME_COLUMN],
          to_dttm: testData[0][TIME_COLUMN],
        }}
        formData={{
          ...formData,
          alignTimeRange: true,
        }}
      />
    ),
    storyName: 'Missing range start (align time range)',
    storyPath: 'legacy-|preset-chart-big-number|BigNumberChartPlugin',
  },
  {
    renderStory: () => (
      <SuperChart
        chartType="big-number"
        width={400}
        height={400}
        queryData={{
          data: testData.slice(0, 9),
          from_dttm: testData[testData.length - 1][TIME_COLUMN],
          to_dttm: testData[0][TIME_COLUMN],
        }}
        formData={{
          ...formData,
          alignTimeRange: false,
        }}
      />
    ),
    storyName: `Missing range start (don't align)`,
    storyPath: 'legacy-|preset-chart-big-number|BigNumberChartPlugin',
  },
];
