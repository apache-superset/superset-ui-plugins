/* eslint-disable no-magic-numbers, sort-keys */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import data from './data';

export default [
  {
    renderStory: () => (
      <SuperChart
        chartType="v2-box-plot"
        chartProps={{
          datasource: { verboseMap: {} },
          formData: {
            encoding: {
              x: {
                type: 'nominal',
                field: 'label',
                scale: {
                  type: 'band',
                  paddingInner: 0.15,
                  paddingOuter: 0.3,
                },
                axis: {
                  label: 'Region',
                  orientation: 'bottom',
                },
              },
              y: {
                type: 'quantitative',
                scale: {
                  type: 'linear',
                },
                axis: {
                  label: 'Population',
                  numTicks: 5,
                  orientation: 'left',
                },
              },
              color: {
                type: 'nominal',
                field: 'label',
                scale: {
                  scheme: 'd3Category10',
                },
                legend: false,
              },
            },
          },
          height: 400,
          payload: { data },
          width: 400,
        }}
      />
    ),
    storyName: 'Basic',
    storyPath: 'preset-chart-xy|BoxPlotChartPlugin',
  },
  {
    renderStory: () => (
      <SuperChart
        chartType="v2-box-plot/legacy"
        chartProps={{
          datasource: { verboseMap: {} },
          formData: {
            colorScheme: 'd3Category10',
            groupby: ['region'],
            metrics: ['sum__SP_POP_TOTL'],
            vizType: 'box_plot',
            whiskerOptions: 'Min/max (no outliers)',
          },
          height: 400,
          payload: { data },
          width: 400,
        }}
      />
    ),
    storyName: 'Use Legacy API shim',
    storyPath: 'preset-chart-xy|BoxPlotChartPlugin',
  },
];
