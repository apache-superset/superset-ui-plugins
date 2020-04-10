import React from 'react';
import { TooltipFrame, TooltipTable } from '@superset-ui/chart-composition';
import { isFieldDef } from 'encodable/lib/typeGuards/ChannelDef';
import { TooltipProps } from './ScatterPlot';

export default function DefaultTooltipRenderer({ datum, encoder }: TooltipProps) {
  const { channels } = encoder;
  const { x, y, size, fill, stroke } = channels;

  const tooltipRows = [
    { key: 'x', keyColumn: x.getTitle(), valueColumn: x.formatDatum(datum.data) },
    { key: 'y', keyColumn: y.getTitle(), valueColumn: y.formatDatum(datum.data) },
  ];

  if (isFieldDef(fill.definition)) {
    tooltipRows.push({
      key: 'fill',
      keyColumn: fill.getTitle(),
      valueColumn: fill.formatDatum(datum.data),
    });
  }
  if (isFieldDef(stroke.definition)) {
    tooltipRows.push({
      key: 'stroke',
      keyColumn: stroke.getTitle(),
      valueColumn: stroke.formatDatum(datum.data),
    });
  }
  if (isFieldDef(size.definition)) {
    tooltipRows.push({
      key: 'size',
      keyColumn: size.getTitle(),
      valueColumn: size.formatDatum(datum.data),
    });
  }
  channels.group.forEach(g => {
    tooltipRows.push({
      key: `${g.name}`,
      keyColumn: g.getTitle(),
      valueColumn: g.formatDatum(datum.data),
    });
  });
  channels.tooltip.forEach(g => {
    tooltipRows.push({
      key: `${g.name}`,
      keyColumn: g.getTitle(),
      valueColumn: g.formatDatum(datum.data),
    });
  });

  return (
    <TooltipFrame>
      <TooltipTable data={tooltipRows} />
    </TooltipFrame>
  );
}
