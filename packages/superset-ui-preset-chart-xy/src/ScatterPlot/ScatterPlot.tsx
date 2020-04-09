import React, { PureComponent } from 'react';
import { XYChart, PointSeries } from '@data-ui/xy-chart';
import { chartTheme, ChartTheme } from '@data-ui/theme';
import { Margin, Dimension } from '@superset-ui/dimension';
import { WithLegend } from '@superset-ui/chart-composition';
import { isFieldDef } from 'encodable/lib/typeGuards/ChannelDef';
import { Dataset, PlainObject } from 'encodable/lib/types/Data';
import {
  scatterPlotEncoderFactory,
  ScatterPlotEncoder,
  ScatterPlotChannelOutputs,
  ScatterPlotEncodingConfig,
  ScatterPlotEncoding,
} from './Encoder';
import createMarginSelector, { DEFAULT_MARGIN } from '../utils/createMarginSelector';
import DefaultTooltipRenderer from './DefaultTooltipRenderer';
import convertScaleToDataUIScale from '../utils/convertScaleToDataUIScaleShape';
import createXYChartLayoutWithTheme from '../utils/createXYChartLayoutWithTheme';
import createRenderLegend from '../components/legend/createRenderLegend';
import { LegendHooks } from '../components/legend/types';

export interface TooltipProps {
  datum: EncodedPoint;
  encoder: ScatterPlotEncoder;
}

const defaultProps = {
  className: '',
  margin: DEFAULT_MARGIN,
  encoding: {},
  theme: chartTheme,
  TooltipRenderer: DefaultTooltipRenderer,
} as const;

export type HookProps = {
  TooltipRenderer?: React.ComponentType<TooltipProps>;
} & LegendHooks<ScatterPlotEncodingConfig>;

type Props = {
  className?: string;
  width: string | number;
  height: string | number;
  margin?: Margin;
  data: Dataset;
  encoding?: Partial<ScatterPlotEncoding>;
  theme?: ChartTheme;
} & HookProps &
  Readonly<typeof defaultProps>;

export type EncodedPoint = ScatterPlotChannelOutputs & {
  data: PlainObject;
};

export default class ScatterPlot extends PureComponent<Props> {
  private createEncoder = scatterPlotEncoderFactory.createSelector();

  private createMargin = createMarginSelector();

  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);
  }

  renderChart(dim: Dimension) {
    const { width, height } = dim;
    const { data, margin, theme, TooltipRenderer, encoding } = this.props;
    const encoder = this.createEncoder(encoding);
    const { channels } = encoder;

    encoder.setDomainFromDataset(data);

    const encodedData = data.map(d => ({
      x: channels.x.encodeDatum(d),
      y: channels.y.encodeDatum(d),
      size: channels.size.encodeDatum(d),
      fill: channels.fill.encodeDatum(d),
      stroke: channels.stroke.encodeDatum(d),
      data: d,
    }));

    const layout = createXYChartLayoutWithTheme({
      width,
      height,
      margin: this.createMargin(margin),
      theme,
      xEncoder: channels.x,
      yEncoder: channels.y,
    });

    return layout.renderChartWithFrame((chartDim: Dimension) => (
      <XYChart
        showYGrid
        width={chartDim.width}
        height={chartDim.height}
        ariaLabel="BoxPlot"
        margin={layout.margin}
        renderTooltip={({ datum }: { datum: EncodedPoint }) => (
          <TooltipRenderer datum={datum} encoder={encoder} />
        )}
        theme={theme}
        xScale={convertScaleToDataUIScale(channels.x.definition.scale as any)}
        yScale={convertScaleToDataUIScale(channels.y.definition.scale as any)}
      >
        {layout.renderXAxis()}
        {layout.renderYAxis()}
        <PointSeries
          key={isFieldDef(channels.x.definition) ? channels.x.definition.field : ''}
          data={encodedData}
          fill={(d: EncodedPoint) => d.fill}
          fillOpacity={0.5}
          stroke={(d: EncodedPoint) => d.stroke}
          size={(d: EncodedPoint) => d.size}
        />
      </XYChart>
    ));
  }

  render() {
    const { className, data, width, height, encoding } = this.props;

    const encoder = this.createEncoder(encoding);

    return (
      <WithLegend
        className={`superset-chart-scatter-plot ${className}`}
        width={width}
        height={height}
        position="top"
        renderLegend={createRenderLegend(encoder, data, this.props)}
        renderChart={this.renderChart}
      />
    );
  }
}
