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
/* eslint-disable sort-keys */
import isTruthy from './utils/isTruthy';
import { formatLabel } from './utils';

export default function transformProps(chartProps) {
  const {
    width,
    height,
    annotationData,
    datasource,
    formData,
    onError,
    onAddFilter,
    payload,
  } = chartProps;

  const {
    annotationLayers,
    barStacked,
    bottomMargin,
    colorPicker,
    colorScheme,
    comparisonType,
    contribution,
    donut,
    entity,
    labelsOutside,
    leftMargin,
    lineInterpolation,
    maxBubbleSize,
    orderBars,
    pieLabelType,
    reduceXTicks,
    richTooltip,
    sendTimeRange,
    showBarValue,
    showBrush,
    showControls,
    showLabels,
    showLegend,
    showMarkers,
    size,
    stackedStyle,
    vizType,
    x,
    xAxisFormat,
    xAxisLabel,
    xAxisShowminmax,
    numberFormat,
    xLogScale,
    xTicksLayout,
    y,
    yAxisFormat,
    yAxis2Format,
    yAxisBounds,
    yAxisLabel,
    yAxisShowminmax,
    yLogScale,
  } = formData;

  const rawData = payload.data || [];
  const data = Array.isArray(rawData)
    ? rawData.map(row => ({
        ...row,
        key: formatLabel(row.key, datasource.verboseMap),
      }))
    : rawData;

  // SUP-146
  let d3NumberFormat;
  let d3YAxisFormat;
  let d3YAxis2Format;
  if (chartProps.formData.vizType == "pie") {
      for (let x = 0; x < chartProps.datasource.metrics.length; x++) {
          if (chartProps.datasource.metrics[x].metric_name == chartProps.formData.metric) {
              d3NumberFormat = chartProps.datasource.metrics[x].d3format;
              break;
          }
      }
  } else if (chartProps.formData.vizType == "dual_line") {
      for (let x = 0; x < chartProps.datasource.metrics.length; x++) {
          if (chartProps.datasource.metrics[x].metric_name == chartProps.formData.metric) {
              d3YAxisFormat = chartProps.datasource.metrics[x].d3format;
          } else if (chartProps.datasource.metrics[x].metric_name == chartProps.formData.metric2) {
              d3YAxis2Format = chartProps.datasource.metrics[x].d3format;
          }
      }
  } else if (chartProps.formData.vizType == "line" ||chartProps.formData.vizType == "dist_bar" ||
             chartProps.formData.vizType == "bar" || chartProps.formData.vizType == "area") {
      for (let x = 0; x < chartProps.datasource.metrics.length; x++) {
          if (chartProps.datasource.metrics[x].metric_name == chartProps.formData.metrics[0]) {
              d3YAxisFormat = chartProps.datasource.metrics[x].d3format;
              break;
          }
      }
  }
  //End SUP-146

  return {
    width,
    height,
    data,
    annotationData,
    annotationLayers,
    areaStackedStyle: stackedStyle,
    baseColor: colorPicker,
    bottomMargin,
    colorScheme,
    comparisonType,
    contribution,
    entity,
    isBarStacked: barStacked,
    isDonut: donut,
    isPieLabelOutside: labelsOutside,
    leftMargin,
    lineInterpolation,
    maxBubbleSize: parseInt(maxBubbleSize, 10),
    numberFormat: d3NumberFormat ? d3NumberFormat : numberFormat,
    onBrushEnd: isTruthy(sendTimeRange)
      ? timeRange => {
          onAddFilter('__time_range', timeRange, false, true);
        }
      : undefined,
    onError,
    orderBars,
    pieLabelType,
    reduceXTicks,
    showBarValue,
    showBrush,
    showControls,
    showLabels,
    showLegend,
    showMarkers,
    sizeField: size,
    useRichTooltip: richTooltip,
    vizType,
    xAxisFormat,
    xAxisLabel,
    xAxisShowMinMax: xAxisShowminmax,
    xField: x,
    xIsLogScale: xLogScale,
    xTicksLayout,
    yAxisFormat: d3YAxisFormat ? d3YAxisFormat : yAxisFormat,
    yAxis2Format: d3YAxis2Format ? d3YAxis2Format : yAxis2Format,
    yAxisBounds,
    yAxisLabel,
    yAxisShowMinMax: yAxisShowminmax,
    yField: y,
    yIsLogScale: yLogScale,
  };
}
