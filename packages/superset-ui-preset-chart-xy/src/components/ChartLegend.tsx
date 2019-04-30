import React, { CSSProperties, PureComponent } from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@vx/legend';
import { Value } from 'vega-lite/build/src/channeldef';
import AbstractEncoder from '../encodeable/AbstractEncoder';
import { Dataset } from '../encodeable/types/Data';
import { ObjectWithKeysFromAndValueType } from '../encodeable/types/Base';
import {
  ChannelType,
  EncodingFromChannelsAndOutputs,
  ChannelInput,
} from '../encodeable/types/Channel';
import { BaseOptions } from '../encodeable/types/Specification';
import { isTypedFieldDef } from '../encodeable/types/ChannelDef';

type Props<Encoder> = {
  data: Dataset;
  encoder: Encoder;
};

interface Label {
  text: string;
  value: string;
}

const MARK_SIZE = 8;

const MARK_STYLE: CSSProperties = { display: 'inline-block' };

const LABEL_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  fontSize: '0.8em',
};

const LEGEND_CONTAINER_STYLE: CSSProperties = {
  maxHeight: 100,
  overflowY: 'hidden',
  paddingLeft: 14,
  paddingTop: 6,
  position: 'relative',
};

export default class ChartLegend<
  ChannelTypes extends ObjectWithKeysFromAndValueType<Outputs, ChannelType>,
  Outputs extends ObjectWithKeysFromAndValueType<Encoding, Value>,
  Encoding extends EncodingFromChannelsAndOutputs<
    ChannelTypes,
    Outputs
  > = EncodingFromChannelsAndOutputs<ChannelTypes, Outputs>,
  Options extends BaseOptions = BaseOptions
> extends PureComponent<Props<AbstractEncoder<ChannelTypes, Outputs, Encoding, Options>>, {}> {
  render() {
    const { data, encoder } = this.props;

    const legendInfos = Object.keys(encoder.legends).map((field: string) => {
      const channelNames = encoder.legends[field];
      const channelEncoder = encoder.channels[channelNames[0]];

      if (isTypedFieldDef(channelEncoder.definition)) {
        if (channelEncoder.definition.type === 'nominal') {
          const domain = Array.from(new Set(data.map(channelEncoder.get)));

          return domain.map((value: ChannelInput) => ({
            field,
            value,
            // eslint-disable-next-line sort-keys
            encodedValues: channelNames.reduce(
              (
                prev: Partial<ObjectWithKeysFromAndValueType<ChannelTypes, Value | undefined>>,
                curr,
              ) => {
                const map = prev;
                map[curr] = encoder.channels[curr].encodeValue(value);

                return map;
              },
              {},
            ),
          }));
        }
      }

      return [];
    });

    console.log('legendInfos', legendInfos);

    const legends = Object.keys(encoder.legends).map((field: string) => {
      const channelNames = encoder.legends[field];
      const channelEncoder = encoder.channels[channelNames[0]];
      const domain = Array.from(new Set(data.map(channelEncoder.get)));
      const scale = scaleOrdinal({
        domain,
        range: domain.map((key: ChannelInput) => channelEncoder.encodeValue(key)),
      });

      return (
        <div key={field} style={LEGEND_CONTAINER_STYLE}>
          <LegendOrdinal scale={scale} labelFormat={channelEncoder.formatValue}>
            {(labels: Label[]) => (
              <div style={LABEL_STYLE}>
                {labels.map((label: Label) => (
                  <LegendItem
                    key={`legend-quantile-${label.text}`}
                    margin="0 5px"
                    onClick={() => {
                      alert(`clicked: ${JSON.stringify(label)}`);
                    }}
                  >
                    <svg width={MARK_SIZE} height={MARK_SIZE} style={MARK_STYLE}>
                      <circle
                        fill={label.value}
                        r={MARK_SIZE / 2}
                        cx={MARK_SIZE / 2}
                        cy={MARK_SIZE / 2}
                      />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </div>
            )}
          </LegendOrdinal>
        </div>
      );
    });

    return <>{legends}</>;
  }
}
