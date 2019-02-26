/* eslint-disable sort-keys */

export default function transformProps(chartProps) {
  const { width, height, formData, payload } = chartProps;
  const { colorScheme, xAxisLabel, xAxisFormat, yAxisLabel, yAxisFormat } = formData;

  return {
    data: payload.data.map(({ key, values }) => ({
      keys: { name: key[0] },
      values,
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
