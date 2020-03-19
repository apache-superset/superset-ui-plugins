/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import shortid from 'shortid';
import { t } from '@superset-ui/translation';
import { NumberFormatFunction } from '@superset-ui/number-format/lib/types';
import { getNumberFormatter } from '@superset-ui/number-format';
import { XYChart, AreaSeries, CrossHair, LinearGradient } from '@data-ui/xy-chart';
import { BRAND_COLOR } from '@superset-ui/color';
import { computeMaxFontSize } from '@superset-ui/dimension';

import './BigNumber.css';
import { smartDateVerboseFormatter } from '@superset-ui/time-format';
import { TimeFormatFunction } from '@superset-ui/time-format/lib/types';

const defaultNumberFormatter = getNumberFormatter(undefined);

const CHART_MARGIN = {
  top: 4,
  right: 4,
  bottom: 4,
  left: 4,
};

const PROPORTION = {
  HEADER: 0.3,
  SUBHEADER: 0.125,
  TRENDLINE: 0.3,
};

type TimeSeriesDatum = {
  x: number; // timestamp as a number
  y: number | null;
};

export function renderTooltipFactory(
  formatDate = smartDateVerboseFormatter.formatFunc,
  formatValue = defaultNumberFormatter.formatFunc,
) {
  return function renderTooltip({ datum: { x, y } }: { datum: TimeSeriesDatum }) {
    // even though `formatDate` supports timestamp as numbers, we need
    // `new Date` to pass type check
    return (
      <div style={{ padding: '4px 8px' }}>
        {formatDate(new Date(x))}
        <br />
        <strong>{y === null ? t('N/A') : formatValue(y)}</strong>
      </div>
    );
  };
}

type BigNumberVisProps = {
  className?: string;
  width: number;
  height: number;
  bigNumber: number;
  formatNumber: NumberFormatFunction;
  formatTime: TimeFormatFunction;
  fromDatetime: number;
  toDatetime: number;
  headerFontSize: number;
  subheader: string;
  subheaderFontSize: number;
  showTrendLine: boolean;
  startYAxisAtZero: boolean;
  trendLineData?: TimeSeriesDatum[];
  mainColor: string;
  useFixedTimeRange: boolean;
};

class BigNumberVis extends React.PureComponent<BigNumberVisProps, {}> {
  private gradientId: string = shortid.generate();

  static defaultProps = {
    className: '',
    formatNumber: (num: number) => String(num),
    formatTime: smartDateVerboseFormatter.formatFunc,
    fromDatetime: null,
    headerFontSize: PROPORTION.HEADER,
    mainColor: BRAND_COLOR,
    showTrendLine: false,
    startYAxisAtZero: true,
    subheader: '',
    subheaderFontSize: PROPORTION.SUBHEADER,
    toDatetime: null,
    trendLineData: null,
    useFixedTimeRange: false,
  };

  getClassName() {
    const { className, showTrendLine } = this.props;
    const names = `superset-legacy-chart-big-number ${className}`;
    if (showTrendLine) {
      return names;
    }

    return `${names} no-trendline`;
  }

  createTemporaryContainer() {
    const container = document.createElement('div');
    container.className = this.getClassName();
    container.style.position = 'absolute'; // so it won't disrupt page layout
    container.style.opacity = '0'; // and not visible

    return container;
  }

  renderHeader(maxHeight: number) {
    const { bigNumber, formatNumber, width } = this.props;
    const text = bigNumber === null ? 'No data' : formatNumber(bigNumber);

    const container = this.createTemporaryContainer();
    document.body.append(container);
    const fontSize = computeMaxFontSize({
      text,
      maxWidth: Math.floor(width),
      maxHeight,
      className: 'header-line',
      container,
    });
    document.body.removeChild(container);

    return (
      <div
        className="header-line"
        style={{
          fontSize,
          height: maxHeight,
        }}
      >
        <span>{text}</span>
      </div>
    );
  }

  renderSubheader(maxHeight: number) {
    const { bigNumber, subheader, width } = this.props;
    let fontSize = 0;

    const text =
      bigNumber === null
        ? 'Try applying different filters or ensuring your Datasource contains data'
        : subheader;
    if (text) {
      const container = this.createTemporaryContainer();
      document.body.append(container);
      fontSize = computeMaxFontSize({
        text,
        maxWidth: Math.floor(width),
        maxHeight,
        className: 'subheader-line',
        container,
      });
      document.body.removeChild(container);
    }

    return (
      <div
        className="subheader-line"
        style={{
          fontSize,
          height: maxHeight,
        }}
      >
        {text}
      </div>
    );
  }

  renderTrendline(maxHeight: number) {
    const {
      width,
      trendLineData,
      mainColor,
      subheader,
      startYAxisAtZero,
      fromDatetime,
      toDatetime,
      useFixedTimeRange,
      formatNumber,
      formatTime,
    } = this.props;

    // Apply a fixed X range if a time range is specified.
    //
    // XYChart checks the existence of `domain` property decide whether to apply
    // a domain or not, so it must not be `null` or `undefined`
    const xScale: { type: string; domain?: number[] } = { type: 'timeUtc' };
    const tooltipData = trendLineData?.sort(datum => datum.x);
    if (tooltipData && useFixedTimeRange && fromDatetime && toDatetime) {
      // xScale.domain = [fromDatetime, toDatetime];
      if (tooltipData[0].x > fromDatetime) {
        tooltipData.unshift({
          x: fromDatetime,
          y: null,
        });
      }
      if (tooltipData[tooltipData.length - 1].x < toDatetime) {
        tooltipData.unshift({
          x: toDatetime,
          y: null,
        });
      }
    }

    return (
      <XYChart
        snapTooltipToDataX
        ariaLabel={`Big number visualization ${subheader}`}
        xScale={xScale}
        yScale={{
          type: 'linear',
          includeZero: startYAxisAtZero,
        }}
        width={Math.floor(width)}
        height={maxHeight}
        margin={CHART_MARGIN}
        renderTooltip={renderTooltipFactory(formatTime, formatNumber)}
        eventTrigger="container"
      >
        <LinearGradient id={this.gradientId} from={mainColor} to="#fff" />
        <AreaSeries data={tooltipData} fill={`url(#${this.gradientId})`} stroke={mainColor} />
        <CrossHair
          fullHeight
          stroke={mainColor}
          circleFill={mainColor}
          circleStroke="#fff"
          showHorizontalLine={false}
          strokeDasharray="5,2"
        />
      </XYChart>
    );
  }

  render() {
    const { showTrendLine, height, headerFontSize, subheaderFontSize } = this.props;
    const className = this.getClassName();

    if (showTrendLine) {
      const chartHeight = Math.floor(PROPORTION.TRENDLINE * height);
      const allTextHeight = height - chartHeight;

      return (
        <div className={className}>
          <div className="text-container" style={{ height: allTextHeight }}>
            {this.renderHeader(Math.ceil(headerFontSize * (1 - PROPORTION.TRENDLINE) * height))}
            {this.renderSubheader(
              Math.ceil(subheaderFontSize * (1 - PROPORTION.TRENDLINE) * height),
            )}
          </div>
          {this.renderTrendline(chartHeight)}
        </div>
      );
    }

    return (
      <div className={className} style={{ height }}>
        {this.renderHeader(Math.ceil(headerFontSize * height))}
        {this.renderSubheader(Math.ceil(subheaderFontSize * height))}
      </div>
    );
  }
}

export default BigNumberVis;
