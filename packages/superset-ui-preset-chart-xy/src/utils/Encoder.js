/* eslint-disable sort-keys */

import { getNumberFormatter } from '@superset-ui/number-format';
import { getTimeFormatter } from '@superset-ui/time-format';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { get, cloneDeep, isFunction } from 'lodash/fp';
import { scaleOrdinal } from 'd3-scale';

const IDENTITY = x => x;

const FIELD_MAP = {
  color: 'field',
  fill: 'field',
  strokeDasharray: 'field',
  x: 'xy',
  y: 'xy',
};

function parseAccessor({ value, field }) {
  return value ? () => value : get(field);
}

function parseFormat({ type, format }) {
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

function parseScale({ type, scale }) {
  let scaleFn = IDENTITY;
  if (type === 'nominal' && scale !== false) {
    scaleFn = scaleOrdinal();
    if (scale) {
      const { domain, range, scheme, namespace } = scale;
      if (domain) {
        scaleFn.domain(domain);
      }
      if (range) {
        scaleFn.range(range);
      } else {
        scaleFn = CategoricalColorNamespace.getScale(scheme, namespace);
      }
    }
  }

  return scaleFn;
}

export default class Encoder {
  constructor(encoding) {
    this.encoding = cloneDeep(encoding);
    this.accessors = {};
    this.formats = {};
    this.scales = {};
    this.axes = {};
    this.legends = {};

    Object.keys(encoding).forEach(key => {
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

  encode(datum, field, defaultValue = null) {
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
