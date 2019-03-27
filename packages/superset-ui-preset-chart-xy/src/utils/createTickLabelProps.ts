import { DEFAULT_LABEL_ANGLE } from './constants';

/* eslint-disable no-magic-numbers */

export default function createTickLabelProps({
  labellingStrategy,
  orientation = 'bottom',
  rotation = DEFAULT_LABEL_ANGLE,
  tickTextAnchor = 'start',
}: {
  labellingStrategy: string;
  orientation?: string;
  rotation?: number;
  tickTextAnchor?: string;
}) {
  let dx = 0;
  let dy = 0;
  if (labellingStrategy === 'rotate' && rotation !== 0) {
    dx = rotation > 0 ? -6 : 6;
    if (orientation === 'top') {
      dx = 0;
    }
    dy = orientation === 'top' ? -3 : 0;
  }

  return {
    angle: rotation,
    dx,
    dy,
    textAnchor: tickTextAnchor,
  };
}
