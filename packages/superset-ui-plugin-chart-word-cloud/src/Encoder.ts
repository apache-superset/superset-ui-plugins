import { createEncoderFactory } from 'encodable';
import { DeriveEncoding } from 'encodable/lib/types/Encoding';

type WordCloudEncodingConfig = {
  color: ['Color', string];
  size: ['Numeric', number];
  text: ['Text', string];
};

// eslint-disable-next-line import/prefer-default-export
export const wordCloudEncoderFactory = createEncoderFactory<WordCloudEncodingConfig>({
  channelTypes: {
    color: 'Color',
    size: 'Numeric',
    text: 'Text',
  },
  defaultEncoding: {
    color: { value: 'black' },
    size: { value: 20 },
    text: { value: '' },
  },
});

export type WordCloudEncoding = DeriveEncoding<WordCloudEncodingConfig>;
