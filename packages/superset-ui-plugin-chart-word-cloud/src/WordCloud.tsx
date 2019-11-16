import React from 'react';
import cloudLayout, { Word } from 'd3-cloud';
import { WordCloudEncoding, wordCloudEncoderFactory } from './Encoder';

const ROTATION = {
  flat: () => 0,
  /* eslint-disable-next-line no-magic-numbers */
  random: () => Math.floor(Math.random() * 6 - 3) * 30,
  /* eslint-disable-next-line no-magic-numbers */
  square: () => Math.floor(Math.random() * 2) * 90,
};

interface Datum {
  size: number;
  text: string;
}

/**
 * These props should be stored when saving the chart.
 */
export interface WordCloudVisualProps {
  encoding: Partial<WordCloudEncoding>;
  rotation: keyof typeof ROTATION;
}

export interface WordCloudProps extends WordCloudVisualProps {
  data: Datum[];
  height: number;
  width: number;
}

interface State {
  words: Word[];
}

export default class WordCloud extends React.PureComponent<WordCloudProps, State> {
  isMounted: boolean = false;
  state: State = {
    words: [],
  };

  createEncoder = wordCloudEncoderFactory.createSelector();

  componentDidMount() {
    this.isMounted = true;
    this.update();
  }

  componentDidUpdate(prevProps: WordCloudProps) {
    const { data, encoding, width, height, rotation } = this.props;

    if (
      prevProps.data !== data ||
      prevProps.encoding !== encoding ||
      prevProps.width !== width ||
      prevProps.height !== height ||
      prevProps.rotation !== rotation
    ) {
      this.update();
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  setWords = (words: Word[]) => {
    if (this.isMounted) {
      this.setState({ words });
    }
  };

  update() {
    const { data, width, height, rotation, encoding } = this.props;

    const encoder = this.createEncoder(encoding);
    encoder.channels.size.setDomainFromDataset(data);

    cloudLayout<Datum>()
      .size([width, height])
      .words(data)
      /* eslint-disable-next-line no-magic-numbers */
      .padding(5)
      .rotate(ROTATION[rotation] || ROTATION.flat)
      .font('Helvetica')
      .fontWeight('bold')
      .fontSize(d => encoder.channels.size.encodeDatum(d) as number)
      .on('end', this.setWords)
      .start();
  }

  render() {
    const { width, height, encoding } = this.props;
    const { words } = this.state;

    const encoder = this.createEncoder(encoding);

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {words.map(w => (
            <text
              key={w.text}
              fontSize={`${w.size}px`}
              fontWeight="bold"
              fontFamily="Helvetica"
              fill={encoder.channels.color.encodeDatum(w) as string}
              textAnchor="middle"
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
            >
              {w.text}
            </text>
          ))}
        </g>
      </svg>
    );
  }
}
