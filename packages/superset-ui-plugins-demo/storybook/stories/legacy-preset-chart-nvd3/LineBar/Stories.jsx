/* eslint-disable no-magic-numbers */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import data from './data';

export default [
  {
    renderStory: () => (
      <SuperChart
        chartType="line_bar"
        chartProps={{
          datasource: { verboseMap: {} },
          formData: {
            bottomMargin: 'auto',
            colorScheme: 'd3Category10',
            leftMargin: 'auto',
            lineInterpolation: 'linear',
            richTooltip: true,
            showBrush: 'auto',
            showLegend: true,
            showMarkers: false,
            vizType: 'line_bar',
            xAxisFormat: 'smart_date',
            xAxisLabel: '',
            xAxisShowminmax: false,
            xTicksLayout: 'auto',
            yAxisBounds: [null, null],
            yAxisFormat: '.3s',
            yAxisLabel: '',
            yAxisShowminmax: false,
            yLogScale: false,
          },
          height: 400,
          payload: { data },
          width: 400,
        }}
      />
    ),
    storyName: 'Basic',
    storyPath: 'legacy-|preset-chart-nvd3|LineBarChartPlugin',
  },
  {
    renderStory: () => (
      <SuperChart
        chartType="line_bar"
        chartProps={{
          datasource: { verboseMap: {} },
          formData: {
            bottomMargin: 'auto',
            colorScheme: 'd3Category10',
            leftMargin: 'auto',
            lineInterpolation: 'linear',
            richTooltip: true,
            showBrush: 'auto',
            showLegend: true,
            showMarkers: true,
            vizType: 'line_bar',
            xAxisFormat: 'smart_date',
            xAxisLabel: '',
            xAxisShowminmax: false,
            xTicksLayout: 'auto',
            yAxisBounds: [null, null],
            yAxisFormat: '.3s',
            yAxisLabel: '',
            yAxisShowminmax: false,
            yLogScale: false,
          },
          height: 400,
          payload: { data },
          width: 400,
        }}
      />
    ),
    storyName: 'Markers',
    storyPath: 'legacy-|preset-chart-nvd3|LineBarChartPlugin',
  },
];
