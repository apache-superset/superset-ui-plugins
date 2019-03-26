import React, { CSSProperties } from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@vx/legend';
import { Value } from 'vega-lite/build/src/fielddef';
import AbstractEncoder from '../encodeable/AbstractEncoder';
import { Dataset, PlainObject } from '../encodeable/types/Data';
import { ObjectWithKeysFromAndValueType } from '../encodeable/types/Base';
import { ChannelType, EncodingFromChannelsAndOutputs } from '../encodeable/types/Channel';
import { BaseOptions } from '../encodeable/types/Specification';

type Props<Encoder> = {
  data: Dataset;
  encoder: Encoder;
};

interface Label {
  text: string;
  value: string;
}

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
> extends React.PureComponent<
  Props<AbstractEncoder<ChannelTypes, Outputs, Encoding, Options>>,
  {}
> {
  render() {
    const { data, encoder } = this.props;

    const legends = Object.keys(encoder.legends).map((field: string) => {
      const channelNames = encoder.legends[field];
      const channelEncoder = encoder.channels[channelNames[0]];
      const keySet = new Set();
      data.values.forEach((d: PlainObject) => {
        keySet.add(channelEncoder.get(d));
      });
      const domain = Array.from(keySet);
      const scale = scaleOrdinal({
        domain,
        range: domain.map((key: string) => channelEncoder.encodeValue(key)),
      });

      return (
        <div key={field} style={LEGEND_CONTAINER_STYLE}>
          <LegendOrdinal scale={scale} labelFormat={channelEncoder.formatValue}>
            {(labels: Label[]) => (
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {labels.map((label: Label) => {
                  const size = 8;

                  return (
                    <LegendItem
                      key={`legend-quantile-${label.text}`}
                      margin="0 5px"
                      onClick={() => {
                        alert(`clicked: ${JSON.stringify(label)}`);
                      }}
                    >
                      <svg width={size} height={size} style={{ display: 'inline-block' }}>
                        <circle fill={label.value} r={size / 2} cx={size / 2} cy={size / 2} />
                      </svg>
                      <LegendLabel align="left" margin="0 0 0 4px">
                        {label.text}
                      </LegendLabel>
                    </LegendItem>
                  );
                })}
              </div>
            )}
          </LegendOrdinal>
        </div>
      );
    });

    return <React.Fragment>{legends}</React.Fragment>;
  }
}