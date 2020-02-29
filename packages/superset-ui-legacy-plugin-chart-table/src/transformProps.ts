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
import { ChartProps } from '@superset-ui/chart';
import { QueryFormDataMetric } from '@superset-ui/query';

interface DataRecord {
  [key: string]: unknown;
}

interface DataColumnMeta {
  key: string;
  label: string;
  format?: string;
}

export interface DataTableProps {
  // Each object is { field1: value1, field2: value2 }
  data: DataRecord[];
  height: number;
  alignPositiveNegative: boolean;
  colorPositiveNegative: boolean;
  columns: DataColumnMeta[];
  metrics: DataColumnMeta[];
  percentMetrics: DataColumnMeta[];
  includeSearch: boolean;
  orderDesc: boolean;
  pageLength: number;
  tableTimestampFormat: string;
  // TODO: add filters back or clean up
  // filters: object;
  // onAddFilter?: (key: string, value: number[]) => void;
  // onRemoveFilter?: (key: string, value: number[]) => void;
  // tableFilter: boolean;
  // timeseriesLimitMetric: string | object;
}

const consolidateMetricShape = (metric: QueryFormDataMetric) => {
  if (typeof metric === 'string') return { key: metric, label: metric };
  return metric;
};

export default function transformProps(chartProps: ChartProps): DataTableProps {
  const { height, datasource, formData, queryData } = chartProps;

  const {
    alignPn,
    colorPn,
    includeSearch,
    orderDesc,
    pageLength,
    metrics: metrics_,
    percentMetrics: percentMetrics_,
    tableTimestampFormat,
  } = formData;
  const { columnFormats, verboseMap } = datasource;
  const { records, columns } = queryData.data;
  const metrics = metrics_.map(consolidateMetricShape);
  const percentMetrics = percentMetrics_.map(consolidateMetricShape);

  const processedColumns = columns.map((key: string) => {
    let label = verboseMap[key];
    // Handle verbose names for percents
    if (!label) {
      if (key[0] === '%') {
        const cleanedKey = key.slice(1);
        label = `% ${verboseMap[cleanedKey] || cleanedKey}`;
      } else {
        label = key;
      }
    }

    return {
      key,
      label,
      format: columnFormats && columnFormats[key],
    };
  });

  return {
    height,
    data: records,
    alignPositiveNegative: alignPn,
    colorPositiveNegative: colorPn,
    columns: processedColumns,
    metrics,
    percentMetrics,
    includeSearch,
    orderDesc,
    pageLength: pageLength && parseInt(pageLength, 10),
    tableTimestampFormat,
  };
}
