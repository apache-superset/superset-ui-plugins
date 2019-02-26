/* eslint-disable no-magic-numbers, sort-keys */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import data from '../data/data';

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
          payload: { data },
          width: 400,
        }}
      />,
    ],
    storyName: 'Basic',
    storyPath: 'preset-chart-xy|LineChartPlugin',
  },
];
