import { ChartProps } from '@superset-ui/chart';

function transformData(data, formData) {
  const { metric, series } = formData;

  const transformedData = data.map(datum => ({
    size: datum[metric.label || metric],
    text: datum[series],
  }));

  return transformedData;
}

export default function transformProps(chartProps) {
  const { width, height, formData, queryData } = chartProps;

  return {
    data: transformData(queryData.data, formData),
    formData,
    height,
    width,
  };
}
