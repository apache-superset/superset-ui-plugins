/* eslint-disable no-magic-numbers */

import React from 'react';
import TooltipFrame from '../components/tooltip/TooltipFrame';
import TooltipTable from '../components/tooltip/TooltipTable';

export default function createTooltip(
  spec: {
    encoding: {
      x: {
        axis: {
          tickFormat: (x: any) => string;
        };
      };
      y: {
        axis: {
          tickFormat: (x: any) => string;
        };
      };
    };
  },
  data: {
    key: string;
    color: string;
  }[],
) {
  function LineTooltip({
    datum = {},
    series = {},
  }: {
    datum: {
      x?: number;
    };
    series: {
      [key: string]: {
        y: number;
      };
    };
  }) {
    return (
      <TooltipFrame>
        <React.Fragment>
          <div>
            <strong>{spec.encoding.x.axis.tickFormat(datum.x)}</strong>
          </div>
          <br />
          {series && (
            <TooltipTable
              data={data
                .filter(({ key }) => series[key])
                .concat()
                .sort((a, b) => series[b.key].y - series[a.key].y)
                .map(({ key, color }) => ({
                  key,
                  keyStyle: {
                    color,
                    fontWeight: series[key] === datum ? 600 : 200,
                  },
                  value: spec.encoding.y.axis.tickFormat(series[key].y),
                }))}
            />
          )}
        </React.Fragment>
      </TooltipFrame>
    );
  }

  return LineTooltip;
}
