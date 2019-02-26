import React from 'react';
import { LegendOrdinal, LegendItem, LegendLabel } from '@vx/legend';
import { scaleOrdinal } from '@vx/scale';

export default function renderLegend(data, encoder) {
  const keySet = new Set();
  data.forEach(d => {
    keySet.add(encoder.accessors.color(d.keys ? d.keys : d));
  });
  const keys = [...keySet.values()];
  const colorScale = scaleOrdinal({
    domain: keys,
    range: keys.map(encoder.scales.color),
  });

  return (
    <div
      style={{
        maxHeight: 100,
        overflowY: 'hidden',
        paddingLeft: 14,
        paddingTop: 6,
        position: 'relative',
      }}
    >
      <LegendOrdinal scale={colorScale} labelFormat={label => label}>
        {labels => (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {labels.map(label => {
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
