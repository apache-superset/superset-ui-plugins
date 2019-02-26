import React, { CSSProperties } from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@vx/legend';
import Encoder from '../encodeable/OldEncoder';
import { PlainObject, PayloadData } from '../types';

const IDENTITY = (x: any) => x;

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

export default function renderLegend(data: PayloadData, encoder: Encoder) {
  const keySet = new Set();
  data.values.forEach((d: PlainObject) => {
    keySet.add(encoder.accessors.color(d));
  });
  const keys = Array.from(keySet);
  const colorScale = scaleOrdinal({
    domain: keys,
    range: keys.map((key: string) => encoder.scales.color(key)),
  });

  return (
    <div style={LEGEND_CONTAINER_STYLE}>
      <LegendOrdinal scale={colorScale} labelFormat={IDENTITY}>
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
}
