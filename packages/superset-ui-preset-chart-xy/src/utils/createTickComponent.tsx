/* eslint-disable no-magic-numbers */

import React, { CSSProperties } from 'react';

export default function createTickComponent({
  labellingStrategy,
  orientation = 'bottom',
  rotation = 40,
  tickTextAnchor = 'start',
}: {
  labellingStrategy: string;
  orientation?: string;
  rotation?: number;
  tickTextAnchor?: string;
}) {
  if (labellingStrategy === 'rotate' && rotation !== 0) {
    let xOffset = rotation > 0 ? -6 : 6;
    if (orientation === 'top') {
      xOffset = 0;
    }
    const yOffset = orientation === 'top' ? -3 : 0;

    const TickComponent = ({
      x,
      y,
      dy,
      formattedValue = '',
      ...textStyle
    }: {
      x: number;
      y: number;
      dy?: number;
      formattedValue: string;
      textStyle: CSSProperties;
    }) => (
      <g transform={`translate(${x + xOffset}, ${y + yOffset})`}>
        <text transform={`rotate(${rotation})`} {...textStyle} textAnchor={tickTextAnchor}>
          {formattedValue}
        </text>
      </g>
    );

    return TickComponent;
  }

  // This will render the tick as horizontal string.
  return null;
}
