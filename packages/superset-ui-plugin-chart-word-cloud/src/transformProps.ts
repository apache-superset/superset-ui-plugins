import { ChartProps } from '@superset-ui/chart';
import { WordCloudEncoding } from './Encoder';
import { WordCloudProps } from './WordCloud';

export default function transformProps(chartProps: ChartProps): WordCloudProps {
  const { width, height, formData, queryData } = chartProps;
  const { colorScheme, metric, rotation, series, sizeTo } = formData;

  const encoding: Partial<WordCloudEncoding> = {
    color: {
      field: series,
      scale: {
        scheme: colorScheme,
      },
      type: 'nominal',
    },
    size: {
      field: metric.label || metric,
      scale: {
        range: [0, sizeTo],
        zero: true,
      },
      type: 'quantitative',
    },
    text: {
      field: series,
    },
  };

  return {
    data: queryData.data,
    encoding,
    height,
    rotation,
    width,
  };
}
