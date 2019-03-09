/* eslint-disable sort-keys */

import { getNumberFormatter, NumberFormatter } from '@superset-ui/number-format';
import { getTimeFormatter, TimeFormatter } from '@superset-ui/time-format';
import { CategoricalColorNamespace, CategoricalColorScale } from '@superset-ui/color';
import { get, cloneDeep, isFunction } from 'lodash/fp';
import { scaleOrdinal } from 'd3-scale';
import { createSelector } from 'reselect';
import { PlainObject, XYEncoding } from '../types';
import isEnabled from './isEnabled';

const IDENTITY = (x: any) => x;

const FIELD_MAP: {
  [key: string]: string;
} = {
  color: 'field',
  fill: 'field',
  strokeDasharray: 'field',
  x: 'xy',
  y: 'xy',
};

function parseAccessor({ value, field }: { value?: any; field: string }) {
  return value ? () => value : get(field);
}

function parseFormat({ type, format }: { type: string; format: string }) {
  if (isFunction(format)) {
    return format;
  }

  switch (type) {
    case 'quantitative':
      return getNumberFormatter(format);
    case 'temporal':
      return getTimeFormatter(format);
    default:
      return IDENTITY;
  }
}

function parseScale({
  type,
  scale,
}: {
  type: string;
  scale:
    | false
    | null
    | {
        domain: any[];
        range: any[];
        scheme: string;
        namespace?: string;
      };
}) {
  if (type === 'nominal' && isEnabled(scale)) {
    const scaleFn = scaleOrdinal();
    if (scale) {
      const { domain, range, scheme, namespace } = scale;
      if (domain) {
        scaleFn.domain(domain);
      }
      if (range) {
        scaleFn.range(range);
      } else {
        return CategoricalColorNamespace.getScale(scheme, namespace);
      }

      return scaleFn;
    }
  }

  return IDENTITY;
}

export default class Encoder {
  static createSelector = function create() {
    return createSelector(
      (encoding: XYEncoding) => encoding,
      (encoding: XYEncoding) => new Encoder(encoding),
    );
  };

  encoding: XYEncoding;

  accessors: {
    [key: string]: (d: PlainObject) => any;
  };

  formats: {
    [key: string]: NumberFormatter | TimeFormatter | ((d: any) => string);
  };

  scales: {
    [key: string]: CategoricalColorScale | ((d: any) => any);
  };

  axes: PlainObject;

  legends: PlainObject;

  constructor(encoding: XYEncoding) {
    this.encoding = cloneDeep(encoding);
    this.accessors = {};
    this.formats = {};
    this.scales = {};
    this.axes = {};
    this.legends = {};

    Object.keys(encoding).forEach((key: string) => {
      const fieldType = FIELD_MAP[key];
      const enc = encoding[key];
      this.accessors[key] = parseAccessor(enc);
      this.formats[key] = parseFormat(enc);
      this.scales[key] = parseScale(enc);

      if (fieldType === 'xy') {
        const { type, axis = {} } = enc;
        const { tickFormat } = axis;
        if (tickFormat) {
          axis.tickFormat = parseFormat({ type, format: axis.tickFormat });
        } else {
          axis.tickFormat = this.formats[key];
        }
        if (enc.axis || enc.axis === undefined) {
          this.axes[key] = axis;
          enc.axis = axis;
        }
      } else {
        const { value, field, legend } = enc;
        if (!value && (legend || legend === undefined)) {
          const entry = this.legends[field];
          if (entry) {
            entry.push(key);
          } else {
            this.legends[field] = [key];
          }
        }
      }
    });
  }

  encode(datum: PlainObject, field: string, defaultValue: any = null) {
    const accessor = this.accessors[field];
    if (accessor) {
      const scale = this.scales[field];
      const value = accessor(datum);

      return scale ? scale(value) : value;
    }

    return defaultValue;
  }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
