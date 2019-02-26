import { getNumberFormatter } from '@superset-ui/number-format';
import { getTimeFormatter } from '@superset-ui/time-format';
import { isTypedFieldDef, ChannelDef } from '../types/fielddef';

export default function parseFormat(definition: ChannelDef) {
  if (isTypedFieldDef(definition)) {
    const { type } = definition;
    const format =
      'format' in definition && definition.format !== undefined ? definition.format : '';
    switch (type) {
      case 'quantitative':
        return getNumberFormatter(format);
      case 'temporal':
        return getTimeFormatter(format);
      default:
    }
  }

  return (v: any) => `${v}`;
}
