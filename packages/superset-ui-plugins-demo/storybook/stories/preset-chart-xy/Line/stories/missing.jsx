/* eslint-disable no-magic-numbers, sort-keys */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import data from '../data/data';

const missingData = data.map(({ keys, values }) => ({
  keys,
  values: values.map(v => ({
    x: v.x,
    y: Math.random() < 0.05 ? null : v.y,
  })),
}));

export default [
  {
    renderStory: () => [
      <SuperChart
        key="line1"
        chartType="v2-line"
        chartProps={{
          datasource: { verboseMap: {} },
          formData: {
            encoding: {
              x: {
                field: 'x',
                type: 'temporal',
                scale: {
                  type: 'time',
                },
                axis: {
                  orientation: 'bottom',
                  label: 'Time',
                  tickFormat: '%Y',
                },
              },
              y: {
                field: 'y',
                type: 'quantitative',
                scale: {
                  type: 'linear',
                },
                axis: {
                  orientation: 'left',
                  label: 'Score',
                },
              },
              color: {
                field: 'name',
                type: 'nominal',
                scale: {},
                legend: true,
              },
            },
          },
          height: 400,
          payload: { data: missingData },
          width: 400,
        }}
      />,
    ],
    storyName: 'with missing data',
    storyPath: 'preset-chart-xy|LineChartPlugin',
  },
];
