import React from 'react';
import { BoxPlotSeries, XYChart } from '@data-ui/xy-chart';
import { chartTheme, ChartTheme } from '@data-ui/theme';
import { Margin, Dimension } from '@superset-ui/dimension';
import { WithLegend } from '@superset-ui/chart-composition';
import DefaultTooltipRenderer from './DefaultTooltipRenderer';
import {
  BoxPlotEncodingConfig,
  BoxPlotEncoding,
  BoxPlotEncoder,
  boxPlotEncoderFactory,
} from './Encoder';
import { Dataset, PlainObject } from '../encodeable/types/Data';
import createMarginSelector, { DEFAULT_MARGIN } from '../utils/selectors/createMarginSelector';
import { BoxPlotDataRow } from './types';
import convertScaleToDataUIScale from '../utils/convertScaleToDataUIScaleShape';
import createXYChartLayoutWithTheme from '../utils2/createXYChartLayoutWithTheme';
import createRenderLegend from '../components/legend2/createRenderLegend';
import { LegendHooks } from '../components/legend2/types';
import { isFieldDef } from '../encodeable/types/ChannelDef';

export interface TooltipProps {
  datum: BoxPlotDataRow;
  color: string;
  encoder: BoxPlotEncoder;
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
} & LegendHooks<BoxPlotEncodingConfig>;

type Props = {
  className?: string;
  width: string | number;
  height: string | number;
  margin?: Margin;
  encoding?: Partial<BoxPlotEncoding>;
  data: Dataset;
  theme?: ChartTheme;
} & HookProps &
  Readonly<typeof defaultProps>;

export default class BoxPlot extends React.PureComponent<Props> {
  private createEncoder = boxPlotEncoderFactory.createSelector();

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

    const isHorizontal =
      isFieldDef(channels.y.definition) && channels.y.definition.type === 'nominal';

    encoder.setDomainFromDataset(data);

    const layout = createXYChartLayoutWithTheme({
      width,
      height,
      margin: this.createMargin(margin),
      theme,
      xEncoder: channels.x,
      yEncoder: channels.y,
    });

    return (
      channels.x.definition.scale !== false &&
      layout.renderChartWithFrame((chartDim: Dimension) => (
        <XYChart
          showYGrid
          width={chartDim.width}
          height={chartDim.height}
          ariaLabel="BoxPlot"
          margin={layout.margin}
          renderTooltip={({ datum, color }: { datum: BoxPlotDataRow; color: string }) => (
            <TooltipRenderer datum={datum} color={color} encoder={encoder} />
          )}
          theme={theme}
          xScale={convertScaleToDataUIScale(channels.x.definition.scale as any)}
          yScale={convertScaleToDataUIScale(channels.y.definition.scale as any)}
        >
          {layout.renderXAxis()}
          {layout.renderYAxis()}
          <BoxPlotSeries
            key={isFieldDef(channels.x.definition) ? channels.x.definition.field : ''}
            animated
            data={
              isHorizontal
                ? data.map(row => ({ ...row, y: channels.y.getValueFromDatum(row) }))
                : data.map(row => ({ ...row, x: channels.x.getValueFromDatum(row) }))
            }
            fill={(datum: PlainObject) => channels.color.encodeDatum(datum, '#55acee')}
            fillOpacity={0.4}
            stroke={(datum: PlainObject) => channels.color.encodeDatum(datum)}
            strokeWidth={1}
            widthRatio={0.6}
            horizontal={isHorizontal}
          />
        </XYChart>
      ))
    );
  }

  render() {
    const { className, data, encoding, width, height } = this.props;

    const encoder = this.createEncoder(encoding);

    return (
      <WithLegend
        className={`superset-chart-box-plot ${className}`}
        width={width}
        height={height}
        position="top"
        renderLegend={createRenderLegend(encoder, data, this.props)}
        renderChart={this.renderChart}
      />
    );
  }
}
