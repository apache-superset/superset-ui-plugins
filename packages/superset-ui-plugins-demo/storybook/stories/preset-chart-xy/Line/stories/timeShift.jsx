/* eslint-disable no-magic-numbers, sort-keys */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import data from '../data/data2';

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
                  // numTicks: 5,
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
                value: '#1abc9c',
                type: 'nominal',
                scale: false,
              },
              fill: {
                field: 'snapshot',
                type: 'nominal',
                scale: {
                  type: 'ordinal',
                  domain: ['Current', 'Last year'],
                  range: [true, false],
                },
                legend: false,
              },
              strokeDasharray: {
                field: 'snapshot',
                type: 'nominal',
                scale: {
                  type: 'ordinal',
                  domain: ['Current', 'Last year'],
                  range: [null, '4 4'],
                },
                legend: false,
              },
            },
          },
          height: 400,
          payload: { data },
          width: 400,
        }}
      />,
    ],
    storyName: 'with time shift',
    storyPath: 'preset-chart-xy|LineChartPlugin',
  },
];
