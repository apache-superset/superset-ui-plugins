// eslint-disable no-unused-vars
import { ValueDef, Value } from 'vega-lite/src/fielddef';
import { Type } from 'vega-lite/src/type';
import { TimeFormatter } from '@superset-ui/time-format';
import { NumberFormatter } from '@superset-ui/number-format';
import { WithScale } from './scale';
import { WithXAxis, WithYAxis, WithAxis } from './axis';
import { WithLegend } from './legend';

export type Formatter = NumberFormatter | TimeFormatter | ((d: any) => string);

// ValueDef is { value: xxx }

// FieldDef is { field: 'fieldName', type: ... }

export interface FieldDef {
  field: string;
  format?: string;
}

export interface TypedFieldDef extends FieldDef {
  type: Type;
}

export type TextFieldDef = FieldDef;

// PropFieldDef is { field: 'fieldName', scale: xxx }

type ScaleFieldDef<V extends Value = Value> = TypedFieldDef & WithScale<V>;

export type MarkPropFieldDef<V extends Value = Value> = ScaleFieldDef<V> & WithLegend;

// PositionFieldDef is { field: 'fieldName', scale: xxx, axis: xxx }

type PositionFieldDefBase<V extends Value = Value> = ScaleFieldDef<V>;

export type XFieldDef<V extends Value = Value> = PositionFieldDefBase<V> & WithXAxis;

export type YFieldDef<V extends Value = Value> = PositionFieldDefBase<V> & WithYAxis;

export type PositionFieldDef<V extends Value = Value> = ScaleFieldDef<V> & WithAxis;

export type MarkPropChannelDef<V extends Value = Value> = MarkPropFieldDef<V> | ValueDef<V>;

export type TextChannelDef = TextFieldDef | ValueDef<string>;

export type ChannelDef<V extends Value = Value> =
  | XFieldDef<V>
  | YFieldDef<V>
  | MarkPropFieldDef<V>
  | TextFieldDef
  | ValueDef<V>;

export function isValueDef<V extends Value>(channelDef: ChannelDef<V>): channelDef is ValueDef<V> {
  return channelDef && 'value' in channelDef && !!channelDef.value;
}

export function isFieldDef<V extends Value>(channelDef: ChannelDef<V>): channelDef is FieldDef {
  return channelDef && 'field' in channelDef && !!channelDef.field;
}

export function isTypedFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is TypedFieldDef {
  return isFieldDef(channelDef) && 'type' in channelDef && !!channelDef.type;
}

export function isScaleFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is ScaleFieldDef {
  return channelDef && ('scale' in channelDef || 'sort' in channelDef);
}

export function isMarkPropFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is MarkPropFieldDef {
  return channelDef && 'legend' in channelDef;
}

export function isPositionFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is PositionFieldDef<V> {
  return channelDef && ('axis' in channelDef || 'stack' in channelDef || 'impute' in channelDef);
}

// export interface BoxPlotEncoding {
//   x: PositionChannelDef;
//   y: PositionChannelDef;
//   color?: ScaleChannelDef<string>;
// }
