/* eslint-disable no-magic-numbers */
const identity = (x: any) => x;

export default function getTickLabels(
  scale: {
    ticks(num?: number): string[] | number[];
    domain(): any[];
    tickFormat(count?: number, specifier?: string): (d: number | { valueOf(): number }) => string;
  },
  axisConfig: {
    tickCount?: number;
    tickValues?: string[] | number[];
    tickFormat?: (x: string | number) => string;
  },
) {
  const { tickCount = 5, tickValues, tickFormat } = axisConfig;
  let values = scale.ticks ? scale.ticks(tickCount) : scale.domain();
  if (tickValues) values = tickValues;

  let format = scale.tickFormat ? scale.tickFormat() : identity;
  if (tickFormat) format = tickFormat;

  return values.map(format);
}
