// eslint-disable no-unused-vars
// import { ValueDef, Value } from 'vega-lite/src/fielddef';
import {
  ValueDef,
  PositionFieldDef,
  ScaleFieldDef,
  Value,
  TextFieldDef,
  TypedFieldDef,
} from 'vega-lite/src/fielddef';
import { StandardType } from 'vega-lite/src/type';
import { TimeFormatter } from '@superset-ui/time-format';
import { NumberFormatter } from '@superset-ui/number-format';

export type Formatter = NumberFormatter | TimeFormatter | ((d: any) => string);

// ValueDef is { value: xxx }
// FieldDef is { field: 'fieldName' }
// ScaleFieldDed is { field: 'fieldName', scale: xxx }
// PositionFieldDef is { field: 'fieldName', scale: xxx, axis: xxx }

type LegendDef = boolean | null;

export type PositionChannelDef = PositionFieldDef<string> | ValueDef<number>;

type ScaleChannelDef<V extends Value = string, L extends LegendDef = LegendDef> =
  | (ScaleFieldDef<string> & {
      legend?: L;
    })
  | ValueDef<V | null>;

export type ScaleChannelDefWithLegend<V extends Value = string> = ScaleChannelDef<V, LegendDef>;

export type ScaleChannelDefWithoutLegend<V extends Value = string> = ScaleChannelDef<
  V,
  false | null
>;

export type ChannelDef<V extends Value = Value> =
  | PositionChannelDef
  | ScaleChannelDef<V>
  | TextFieldDef<string>;

export function isValueDef<V extends Value>(channelDef: ChannelDef<V>): channelDef is ValueDef<V> {
  return channelDef && 'value' in channelDef && channelDef.value !== undefined;
}

export function isFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is PositionFieldDef<string> | ScaleFieldDef<string> {
  return (
    !!channelDef &&
    ('field' in channelDef || ('aggregate' in channelDef && channelDef.aggregate === 'count'))
  );
}

export function isTypedFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is TypedFieldDef<string, StandardType> {
  return isFieldDef(channelDef) && 'type' in channelDef && channelDef.type !== undefined;
}

export function isScaleFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is ScaleFieldDef<string> {
  return !!channelDef && ('scale' in channelDef || 'sort' in channelDef);
}

export function isPositionFieldDef<V extends Value>(
  channelDef: ChannelDef<V>,
): channelDef is PositionFieldDef<string> {
  return !!channelDef && ('axis' in channelDef || 'stack' in channelDef || 'impute' in channelDef);
}

// export interface BoxPlotEncoding {
//   x: PositionChannelDef;
//   y: PositionChannelDef;
//   color?: ScaleChannelDef<string>;
// }
