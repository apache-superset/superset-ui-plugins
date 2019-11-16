import { ChartProps } from '@superset-ui/chart';
import { WordCloudEncoding } from './Encoder';
import { Props } from './WordCloud';

function transformData(data: ChartProps['queryData'][], formData: ChartProps['formData']) {
  const { metric, series } = formData;

  const transformedData = data.map(datum => ({
    size: datum[metric.label || metric],
    text: datum[series],
  }));

  return transformedData;
}

export default function transformProps(chartProps: ChartProps): Props {
  const { width, height, formData, queryData } = chartProps;
  const { colorScheme, rotation, sizeTo } = formData;

  const encoding: Partial<WordCloudEncoding> = {
    color: {
      field: 'text',
      scale: {
        scheme: colorScheme,
      },
      type: 'nominal',
    },
    size: {
      field: 'size',
      scale: {
        range: [0, sizeTo],
        zero: true,
      },
      type: 'quantitative',
    },
    text: {
      field: 'text',
    },
  };

  return {
    data: transformData(queryData.data, formData),
    encoding,
    height,
    rotation,
    width,
  };
}
