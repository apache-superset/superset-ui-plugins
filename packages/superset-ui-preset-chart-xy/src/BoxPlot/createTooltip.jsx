import { isDefined } from '@superset-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import TooltipFrame from '../components/tooltip/TooltipFrame';
import TooltipTable from '../components/tooltip/TooltipTable';

export default function createBoxPlotTooltip(formatValue) {
  const propTypes = {
    color: PropTypes.string,
    datum: PropTypes.shape({
      firstQuartile: PropTypes.number,
      max: PropTypes.number,
      median: PropTypes.number,
      min: PropTypes.number,
      outliers: PropTypes.arrayOf(PropTypes.number),
      thirdQuartile: PropTypes.number,
    }).isRequired,
  };
  const defaultProps = {
    color: '#222',
  };

  function BoxPlotTooltip({ datum, color }) {
    const { label, min, max, median, firstQuartile, thirdQuartile, outliers } = datum;

    const data = [];
    if (isDefined(min)) {
      data.push({ key: 'Min', value: formatValue(min) });
    }
    if (isDefined(max)) {
      data.push({ key: 'Max', value: formatValue(max) });
    }
    if (isDefined(median)) {
      data.push({ key: 'Median', value: formatValue(median) });
    }
    if (isDefined(firstQuartile)) {
      data.push({ key: '1st Quartile', value: formatValue(firstQuartile) });
    }
    if (isDefined(thirdQuartile)) {
      data.push({ key: '3rd Quartile', value: formatValue(thirdQuartile) });
    }
    if (isDefined(outliers) && outliers.length > 0) {
      data.push({ key: '# Outliers', value: outliers.length });
    }

    return (
      <TooltipFrame>
        <div>
          <strong style={{ color }}>{label}</strong>
        </div>
        {data.length > 0 && <br />}
        <TooltipTable data={data} />
      </TooltipFrame>
    );
  }

  BoxPlotTooltip.propTypes = propTypes;
  BoxPlotTooltip.defaultProps = defaultProps;

  return BoxPlotTooltip;
}
