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
  ScatterPlotEncodingConfig,
  ScatterPlotEncoding,
} from './Encoder';
import createMarginSelector, { DEFAULT_MARGIN } from '../../utils/createMarginSelector';
import DefaultTooltipRenderer from './DefaultTooltipRenderer';
import convertScaleToDataUIScale from '../../utils/convertScaleToDataUIScaleShape';
import createXYChartLayoutWithTheme from '../../utils/createXYChartLayoutWithTheme';
import createRenderLegend from '../legend/createRenderLegend';
import { LegendHooks } from '../legend/types';

export interface TooltipProps {
  datum: PlainObject;
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
      x: channels.x.getValueFromDatum(d),
      y: channels.y.getValueFromDatum(d),
      ...d,
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
        renderTooltip={({ datum }: { datum: PlainObject }) => (
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
          fill={(d: PlainObject) => channels.fill.encodeDatum(d)}
          fillOpacity={0.5}
          stroke={(d: PlainObject) => channels.stroke.encodeDatum(d)}
          size={(d: PlainObject) => channels.size.encodeDatum(d)}
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
