import { DateTime } from 'vega-lite/build/src/datetime';
import { AxisOrient } from 'vega';

export interface Axis {
  format?: string;
  /** The padding, in pixels, between axis and text labels. */
  labelPadding?: number;
  orient?: AxisOrient;
  title?: string;
  tickCount?: number;
  /** Explicitly set the visible axis tick values. */
  values?: string[] | number[] | boolean[] | DateTime[];
}

export type XAxis = Axis & {
  orient?: 'top' | 'bottom';
  labelAngle?: number;
  labelOverlap?: string;
};

export interface WithXAxis {
  axis?: XAxis;
}

export type YAxis = Axis & {
  orient?: 'left' | 'right';
};

export interface WithYAxis {
  axis?: YAxis;
}

export interface WithAxis {
  axis?: XAxis | YAxis;
}

export function isAxis(axis: Axis | null | undefined | false): axis is Axis {
  return axis !== false && axis !== null && axis !== undefined;
}
