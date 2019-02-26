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
    values?: string[] | number[];
    format?: (x: string | number) => string;
  },
) {
  const { tickCount = 5, values, format } = axisConfig;

  let formatFn = scale.tickFormat ? scale.tickFormat() : identity;
  if (format) formatFn = format;

  if (values) {
    return values.map(formatFn);
  }

  return (scale.ticks ? scale.ticks(tickCount) : scale.domain()).map(format);
}
