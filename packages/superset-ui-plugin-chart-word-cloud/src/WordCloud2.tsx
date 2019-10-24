import React from 'react';
import { extent as d3Extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import cloudLayout from 'd3-cloud';
import { CategoricalColorNamespace } from '@superset-ui/color';

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

export interface Props {
  colorScheme: string;
  data: Datum[];
  height: number;
  rotation: 'flat' | 'random' | 'square';
  sizeRange: number[];
  width: number;
}

interface State {
  words: d3.layout.cloud.Word[];
}

export default class WordCloud extends React.PureComponent<Props, State> {
  isMounted: boolean = false;
  state: State = {
    words: [],
  };

  componentDidMount() {
    this.isMounted = true;
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  update() {
    const { data, width, height, rotation, sizeRange } = this.props;

    const size: [number, number] = [width, height];
    const rotationFn = ROTATION[rotation] || ROTATION.flat;

    const scale = scaleLinear()
      .range(sizeRange)
      .domain(d3Extent(data, d => d.size) as [number, number]);

    cloudLayout<Datum>()
      .size(size)
      .words(data)
      /* eslint-disable-next-line no-magic-numbers */
      .padding(5)
      .rotate(rotationFn)
      .font('Helvetica')
      .fontWeight('bold')
      .fontSize(d => scale(d.size))
      .on('end', (words: d3.layout.cloud.Word[]) => {
        if (this.isMounted) {
          this.setState({ words });
        }
      })
      .start();
  }

  render() {
    const { width, height, colorScheme } = this.props;
    const { words } = this.state;

    const colorFn = CategoricalColorNamespace.getScale(colorScheme);

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {words.map(w => (
            <text
              key={w.text}
              fontSize={`${w.size}px`}
              fontWeight="bold"
              fontFamily="Helvetica"
              fill={colorFn(w.text)}
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
