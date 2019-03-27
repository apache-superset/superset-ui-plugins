/* eslint-disable no-magic-numbers */

import { getTextDimension } from '@superset-ui/dimension';
import { CSSProperties } from 'react';

export default function computeXAxisLayout({
  axisLabelHeight = 20,
  axisWidth,
  gapBetweenAxisLabelAndBorder = 8,
  gapBetweenTickAndTickLabel = 4,
  gapBetweenTickLabelsAndAxisLabel = 4,
  labelAngle = -40,
  labelOverlap = 'auto',
  orient = 'bottom',
  tickLabels,
  tickLength,
  tickTextStyle,
}: {
  axisLabelHeight?: number;
  axisWidth: number;
  gapBetweenAxisLabelAndBorder?: number;
  gapBetweenTickAndTickLabel?: number;
  gapBetweenTickLabelsAndAxisLabel?: number;
  labelOverlap?: string;
  orient?: string;
  labelAngle?: number;
  tickLabels: string[];
  tickLength: number;
  tickTextStyle: CSSProperties;
}) {
  const labelDimensions = tickLabels.map((text: string) =>
    getTextDimension({
      style: tickTextStyle,
      text,
    }),
  );

  const maxWidth = Math.max(...labelDimensions.map(d => d.width));
  // cheap heuristic, can improve
  const widthPerTick = axisWidth / tickLabels.length;

  let finalStrategy;
  if (labelOverlap !== 'auto') {
    finalStrategy = labelOverlap;
  } else if (maxWidth <= widthPerTick) {
    finalStrategy = 'flat';
  } else {
    finalStrategy = 'rotate';
  }
  // TODO: Add other strategies: stagger, chop, wrap.

  let layout: {
    labelAngle?: number;
    labelOffset: number;
    tickTextAnchor?: string;
  } = { labelOffset: 0 };
  if (finalStrategy === 'flat') {
    const labelHeight = labelDimensions[0].height;
    const labelOffset = labelHeight + gapBetweenTickLabelsAndAxisLabel;
    layout = { labelOffset };
  } else if (finalStrategy === 'rotate') {
    const labelHeight = Math.ceil(Math.abs(maxWidth * Math.sin((labelAngle * Math.PI) / 180)));
    const labelOffset = labelHeight + gapBetweenTickLabelsAndAxisLabel;
    const tickTextAnchor =
      (orient === 'top' && labelAngle > 0) || (orient === 'bottom' && labelAngle < 0)
        ? 'end'
        : 'start';
    layout = {
      labelAngle,
      labelOffset,
      tickTextAnchor,
    };
  }

  const { labelOffset } = layout;

  return {
    ...layout,
    labelOverlap: finalStrategy,
    minMargin: {
      [orient]: Math.ceil(
        tickLength +
          gapBetweenTickAndTickLabel +
          labelOffset +
          axisLabelHeight +
          gapBetweenAxisLabelAndBorder +
          8,
      ),
    },
    orient,
  };
}
