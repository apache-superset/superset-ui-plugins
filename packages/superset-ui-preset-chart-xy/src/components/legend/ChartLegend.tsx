import React, { CSSProperties, PureComponent } from 'react';
import { Value } from 'vega-lite/build/src/channeldef';
import AbstractEncoder from '../../encodeable/AbstractEncoder';
import { Dataset } from '../../encodeable/types/Data';
import { ObjectWithKeysFromAndValueType } from '../../encodeable/types/Base';
import { ChannelType, EncodingFromChannelsAndOutputs } from '../../encodeable/types/Channel';
import { BaseOptions } from '../../encodeable/types/Specification';
import {
  LegendItemRendererType,
  LegendGroupRendererType,
  LegendItemLabelRendererType,
  LegendItemMarkRendererType,
} from './types';
import DefaultLegendGroup from './DefaultLegendGroup';

const LEGEND_CONTAINER_STYLE: CSSProperties = {
  display: 'flex',
  flex: '1 1 auto',
  maxHeight: 100,
  overflowY: 'auto',
  padding: 8,
  position: 'relative',
};

export type Hooks<ChannelTypes> = {
  LegendGroupRenderer?: LegendGroupRendererType<ChannelTypes>;
  LegendItemRenderer?: LegendItemRendererType<ChannelTypes>;
  LegendItemMarkRenderer?: LegendItemMarkRendererType<ChannelTypes>;
  LegendItemLabelRenderer?: LegendItemLabelRendererType<ChannelTypes>;
};

export type Props<Encoder, ChannelTypes> = {
  data: Dataset;
  encoder: Encoder;
  maxHeight?: number;
} & Hooks<ChannelTypes>;

export default class ChartLegend<
  ChannelTypes extends ObjectWithKeysFromAndValueType<Outputs, ChannelType>,
  Outputs extends ObjectWithKeysFromAndValueType<Encoding, Value>,
  Encoding extends EncodingFromChannelsAndOutputs<
    ChannelTypes,
    Outputs
  > = EncodingFromChannelsAndOutputs<ChannelTypes, Outputs>,
  Options extends BaseOptions = BaseOptions
> extends PureComponent<
  Props<AbstractEncoder<ChannelTypes, Outputs, Encoding, Options>, ChannelTypes>,
  {}
> {
  render() {
    const {
      data,
      encoder,
      LegendGroupRenderer,
      LegendItemRenderer,
      LegendItemMarkRenderer,
      LegendItemLabelRenderer,
      maxHeight = LEGEND_CONTAINER_STYLE.maxHeight,
    } = this.props;

    const LegendGroup =
      typeof LegendGroupRenderer === 'undefined' ? DefaultLegendGroup : LegendGroupRenderer;

    return (
      <div
        style={
          maxHeight === LEGEND_CONTAINER_STYLE.maxHeight
            ? LEGEND_CONTAINER_STYLE
            : { ...LEGEND_CONTAINER_STYLE, maxHeight }
        }
      >
        {encoder.getLegendInfos(data).map(items => (
          <LegendGroup
            key={items[0].field}
            items={items}
            ItemRenderer={LegendItemRenderer}
            ItemMarkRenderer={LegendItemMarkRenderer}
            ItemLabelRenderer={LegendItemLabelRenderer}
          />
        ))}
      </div>
    );
  }
}
