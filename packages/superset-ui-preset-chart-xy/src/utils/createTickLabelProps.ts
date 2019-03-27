import { DEFAULT_LABEL_ANGLE } from './constants';

/* eslint-disable no-magic-numbers */

export default function createTickLabelProps({
  labelOverlap,
  labelAngle = DEFAULT_LABEL_ANGLE,
  orient = 'bottom',
  tickTextAnchor = 'start',
}: {
  labelOverlap: string;
  labelAngle?: number;
  orient?: string;
  tickTextAnchor?: string;
}) {
  let dx = 0;
  let dy = 0;
  if (labelOverlap === 'rotate' && labelAngle !== 0) {
    dx = labelAngle > 0 ? -6 : 6;
    if (orient === 'top') {
      dx = 0;
    }
    dy = orient === 'top' ? -3 : 0;
  }

  return {
    angle: labelAngle,
    dx,
    dy,
    textAnchor: tickTextAnchor,
  };
}
