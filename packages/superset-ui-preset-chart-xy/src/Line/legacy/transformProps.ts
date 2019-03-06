/* eslint-disable sort-keys */
import { ChartProps } from '@superset-ui/chart';

interface DataRow {
  key: string[];
  values: {
    x: number;
    y: number;
  }[];
}

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, payload } = chartProps;
  const { colorScheme, xAxisLabel, xAxisFormat, yAxisLabel, yAxisFormat } = formData;
  const data: DataRow[] = payload.data as DataRow[];

  return {
    data: data.map((row: DataRow) => ({
      keys: { name: row.key[0] },
      values: row.values,
    })),
    width,
    height,
    encoding: {
      x: {
        field: 'x',
        type: 'temporal',
        scale: {
          type: 'time',
        },
        axis: {
          orientation: 'bottom',
          label: xAxisLabel,
          // numTicks: 5,
          tickFormat: xAxisFormat,
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
          label: yAxisLabel,
          tickFormat: yAxisFormat,
        },
      },
      color: {
        field: 'name',
        type: 'nominal',
        scale: {
          scheme: colorScheme,
        },
        legend: true,
      },
    },
  };
}
