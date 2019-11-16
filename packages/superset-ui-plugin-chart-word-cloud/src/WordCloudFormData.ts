import { QueryFormData } from '@superset-ui/query';
import { WordCloudVisualProps } from './WordCloud';

// FormData for wordcloud contains both common properties of all form data
// and properties specific to wordcloud visualization
type WordCloudFormData = QueryFormData &
  WordCloudVisualProps & {
    series: string;
  };

export default WordCloudFormData;
