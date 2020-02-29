/* eslint-disable no-magic-numbers */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import { Props as SuperChartProps } from '@superset-ui/chart/lib/components/SuperChart';
import data from './data';
import birthNames from './birth_names.json';

import 'bootstrap/dist/css/bootstrap.min.css';

function paginated(props: SuperChartProps, pageSize = 50) {
  if (props?.formData) {
    props.formData.page_length = pageSize;
  }
  if (props?.queryData?.form_data) {
    props.queryData.form_data.page_length = pageSize;
  }
  return props;
}

export default [
  {
    renderStory: () => (
      <SuperChart
        chartType="table"
        width={400}
        height={400}
        datasource={{
          columnFormats: {},
          verboseMap: {
            name: 'name',
            sum__num: 'sum__num',
          },
        }}
        filters={{}}
        queryData={{ data }}
        formData={{
          alignPn: false,
          colorPn: false,
          includeSearch: false,
          metrics: ['sum__num'],
          orderDesc: true,
          pageLength: 0,
          percentMetrics: [],
          tableFilter: false,
          tableTimestampFormat: '%Y-%m-%d %H:%M:%S',
          timeseriesLimitMetric: null,
        }}
      />
    ),
    storyName: 'Basic',
    storyPath: 'legacy-|plugin-chart-table|TableChartPlugin',
  },
  {
    renderStory() {
      return <SuperChart {...paginated(birthNames, 100)} chartType="table" />;
    },
    storyName: 'Big Chart',
    storyPath: 'legacy-|plugin-chart-table|TableChartPlugin',
  },
];
