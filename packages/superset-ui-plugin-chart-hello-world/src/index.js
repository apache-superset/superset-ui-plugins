import { t } from '@superset-ui/translation';
import { ChartMetadata, ChartPlugin, ChartControlPanel } from '@superset-ui/chart';
import buildQuery from './buildQuery';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

const metadata = new ChartMetadata({
  credits: null,
  description: '',
  name: t('Hello World!'),
  thumbnail,
});

const controlPanel = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['series'], ['metric'], ['adhoc_filters']],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'size_from',
            config: {
              type: 'TextControl',
              isInt: true,
              label: t('Minimum Font Size'),
              renderTrigger: true,
              default: 10,
              description: t('Font size for the smallest value in the list'),
            },
          },
          {
            name: 'size_to',
            config: {
              type: 'TextControl',
              isInt: true,
              label: t('Maximum Font Size'),
              renderTrigger: true,
              default: 70,
              description: t('Font size for the biggest value in the list'),
            },
          },
        ],
        [
          {
            name: 'rotation',
            config: {
              type: 'SelectControl',
              label: t('Word Rotation'),
              choices: [['random', 'random'], ['flat', 'flat'], ['square', 'square']],
              renderTrigger: true,
              default: 'square',
              clearable: false,
              description: t('Rotation to apply to words in the cloud'),
            },
          },
        ],
        ['color_scheme', 'label_colors'],
      ],
    },
  ],
  controlOverrides: {
    series: {
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};

export default class WordCloudChartPlugin extends ChartPlugin {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./ReactHelloWorld'),
      metadata,
      useLegacyApi: false,
      transformProps,
    });
  }
}
