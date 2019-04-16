import { t } from '@superset-ui/translation';
import { ChartMetadata } from '@superset-ui/chart';
import thumbnail from './images/thumbnail.png';

const metadata = new ChartMetadata({
  description: '',
  name: t('Bubble Chart'),
  thumbnail,
});

export default metadata;
