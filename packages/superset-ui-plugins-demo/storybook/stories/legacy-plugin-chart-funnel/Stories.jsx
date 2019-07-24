/* eslint-disable no-magic-numbers */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import data from './data';
import D3Funnel from 'd3-funnel';
import d3 from 'd3';

export default [
  {
    renderStory: () => (
      <SuperChart
        chartType="funnel"
        chartProps={{
          width: 600,
          height: 500,
          payload: { data },
          formData: {
            bottom_pinch: 1,
            dynamic_height: true,
            dynamic_slope: true,
            inverted: false,
            fill_type: 'gradient', //solid or gradient
            min_height: 5,
            highlight: true,
            font_size: '10px',
            curve_enabled: false,
            curve_height: 5,
            tooltip_enabled: true,
            tooltip_format: '{f}',
            label_format: '{l}: {p}',
            color_scheme: d3.schemeCategory10,
          },
        }}
      />
    ),
    storyName: 'Basic',
    storyPath: 'legacy-|plugin-chart-funnel|FunnelChartPlugin',
  },
];
