import { t } from '@superset-ui/translation';
import { ChartMetadata } from '@superset-ui/chart';
import thumbnail from './images/thumbnail.png';

const metadata = new ChartMetadata({
  description: '',
  name: t('Box Plot'),
  thumbnail,
});

export default metadata;
