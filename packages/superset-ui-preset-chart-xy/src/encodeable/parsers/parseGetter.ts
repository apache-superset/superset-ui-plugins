import { get } from 'lodash/fp';
import { isValueDef, ChannelDef } from '../types';
import identity from '../utils/identity';

export default function parseGetter(definition: ChannelDef) {
  if (isValueDef(definition)) {
    return () => definition.value;
  } else if ('field' in definition && definition.field !== undefined) {
    return get(definition.field);
  }

  return identity;
}
