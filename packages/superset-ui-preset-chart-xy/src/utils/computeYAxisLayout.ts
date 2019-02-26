/* eslint-disable no-magic-numbers */

import { getTextDimension } from '@superset-ui/dimension';
import { CSSProperties } from 'react';

export default function computeYAxisLayout({
  axisLabelHeight = 20,
  gapBetweenAxisLabelAndBorder = 8,
  gapBetweenTickAndTickLabel = 4,
  gapBetweenTickLabelsAndAxisLabel = 4,
  orientation = 'left',
  tickLabels,
  tickLength,
  tickTextStyle,
}: {
  axisLabelHeight?: number;
  gapBetweenAxisLabelAndBorder?: number;
  gapBetweenTickAndTickLabel?: number;
  gapBetweenTickLabelsAndAxisLabel?: number;
  orientation?: string;
  tickLabels: string[];
  tickLength: number;
  tickTextStyle: CSSProperties;
}) {
  const labelDimensions = tickLabels.map(text =>
    getTextDimension({
      style: tickTextStyle,
      text,
    }),
  );

  const maxWidth = Math.ceil(Math.max(...labelDimensions.map(d => d.width)));
  const labelOffset = Math.ceil(maxWidth + gapBetweenTickLabelsAndAxisLabel + axisLabelHeight);

  const margin =
    tickLength + gapBetweenTickAndTickLabel + labelOffset + gapBetweenAxisLabelAndBorder;

  return {
    labelOffset,
    minMargin: {
      [orientation]: margin,
    },
    orientation,
  };
}
