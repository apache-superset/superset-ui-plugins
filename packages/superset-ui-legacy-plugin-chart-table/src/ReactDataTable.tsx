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
import { t } from '@superset-ui/translation';
import React, { useEffect, createRef } from 'react';
import { getNumberFormatter, NumberFormats } from '@superset-ui/number-format';
import { getTimeFormatter } from '@superset-ui/time-format';
import { DataTableProps } from './transformProps';
import dompurify from 'dompurify';

// initialize datatables.net
import $ from 'jquery';
import dt from 'datatables.net-bs/js/dataTables.bootstrap';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import './Table.css';

// depending on how the modules are imported, `dt` may be a CommonJS init function,
// or the DataTable class itself. In case it is the former, we'd need to tell it
//where is jQuery.
if (!dt.$) {
  dt(window, $);
}

const formatPercent = getNumberFormatter(NumberFormats.PERCENT_3_POINT);

const adjustTableHeight = ($root: any, height: number) => {
  const headHeight = $root.find('.dataTables_scrollHead').height();
  const filterHeight = $root.find('.dataTables_filter').height() || 0;
  const pageLengthHeight = $root.find('.dataTables_length').height() || 0;
  let paginationHeight = $root.find('.dataTables_paginate').height() || 0;
  const controlsHeight = pageLengthHeight > filterHeight ? pageLengthHeight : filterHeight;
  $root
    .find('.dataTables_scrollBody')
    .css('max-height', height - headHeight - controlsHeight - paginationHeight);
};

// const NOOP = () => { };

export default function ReactDataTable(props: DataTableProps) {
  const {
    data,
    height,
    alignPositiveNegative = false,
    colorPositiveNegative = false,
    columns,
    includeSearch = false,
    metrics: aggMetrics,
    pageLength,
    percentMetrics,
    tableTimestampFormat,
    // orderDesc,
    // TODO: add back the broken dashboard filters feature
    // filters = {},
    // onAddFilter = NOOP,
    // onRemoveFilter = NOOP,
    // tableFilter,
    // timeseriesLimitMetric,
  } = props;

  const formatTimestamp = getTimeFormatter(tableTimestampFormat);
  const metrics = (aggMetrics || [])
    .concat(percentMetrics || [])
    .map(m => m.label)
    // Removing metrics (aggregates) that are strings
    .filter(m => typeof (data[0] as any)[m] === 'number');

  // collect min/max for numbers, used later for rendering bars
  const maxes: { [key: string]: number } = {};
  const mins: { [key: string]: number } = {};

  // Specify options for each data table columns
  // Ref: https://datatables.net/reference/option/columns
  const columnOptions = columns.map(({ key, format, label }) => {
    const isMetric = metrics.includes(key);
    const vals = data.map(row => row[key]);
    let className = isMetric ? 'dt-metric' : '';

    if (isMetric) {
      const nums = vals as number[];
      if (alignPositiveNegative) {
        maxes[key] = Math.max(...nums.map(Math.abs));
      } else {
        maxes[key] = Math.max(...nums);
        mins[key] = Math.min(...nums);
      }
    }

    // Ref: https://datatables.net/reference/option/columns.render
    const renderCell = (val: unknown, type: string | undefined) => {
      // format values only for display and search
      if (type === 'display' || type === 'search') {
        if (key === '__timestamp') {
          return formatTimestamp(val);
        }
        if (typeof val === 'string') {
          return dompurify.sanitize(val);
        }
        if (isMetric) {
          // default format '' will return human readable numbers (e.g. 50M, 33k)
          return getNumberFormatter(format || '')(val as number);
        }
        if (key[0] === '%') {
          return formatPercent(val);
        }
      }
      return val;
    };

    return {
      key,
      format,
      isMetric,
      className,
      title: label,
      data: key,
      render: renderCell,
    };
  });

  const viewportHeight = Math.min(height, window.innerHeight);
  const pageLengthChoices = [10, 25, 40, 50, 75, 100, 150, 200];
  const options = {
    data,
    aaSorting: [], // initial sorting order, reset to [] to use backend ordering
    autoWidth: false,
    columns: columnOptions,
    paging: pageLength > 0,
    pagingType: 'first_last_numbers',
    pageLength,
    lengthMenu: [
      [...pageLengthChoices, -1],
      [...pageLengthChoices, t('All')],
    ],
    searching: includeSearch,
    language: {
      paginate: {
        first: t('First'),
        last: t('Last'),
        previous: t('Previous'),
        next: t('Next'),
      },
    },
    bInfo: false,
    scrollY: `${viewportHeight}px`,
    scrollCollapse: true,
    scrollX: true,
    drawCallback,
  };
  const rootElem = createRef<HTMLDivElement>();

  useEffect(() => {
    const $container = $(rootElem.current as HTMLElement);
    const dataTable = $container.find('.dataTable').DataTable(options);
    adjustTableHeight($container.find('.dataTables_wrapper'), viewportHeight);
    return () => {
      dataTable.destroy();
    };
  });

  /**
   * Adjust styles after rendering the table, mostly for adding bars for metrics
   * and adjust the pagination size (which is not configurable via DataTables API).
   */
  function drawCallback(this: DataTables.JQueryDataTables) {
    const table = this.api();
    const metricCols = table.columns('.dt-metric', { page: 'current' });
    const cellData = metricCols.data();
    metricCols.every(function(colIdx, _, colIterIdx) {
      const key = columnOptions[colIdx].data;
      this.nodes().each((item, i) => {
        const val = cellData[colIterIdx][i];
        $(item)
          .attr('title', val)
          .css('background-image', cellBar(key, val));
      });
    });
    // force smaller pagination
    $('.pagination', rootElem.current as HTMLElement).addClass('pagination-sm');
  }

  /**
   * Cell background to render columns as horizontal bar chart
   */
  function cellBar(key: string, val: number) {
    const r = colorPositiveNegative && val < 0 ? 150 : 0;
    if (alignPositiveNegative) {
      const perc = Math.abs(Math.round((val / maxes[key]) * 100));
      // The 0.01 to 0.001 is a workaround for what appears to be a
      // CSS rendering bug on flat, transparent colors
      return (
        `linear-gradient(to right, rgba(${r},0,0,0.2), rgba(${r},0,0,0.2) ${perc}%, ` +
        `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`
      );
    }
    const posExtent = Math.abs(Math.max(maxes[key], 0));
    const negExtent = Math.abs(Math.min(mins[key], 0));
    const tot = posExtent + negExtent;
    const perc1 = Math.round((Math.min(negExtent + val, negExtent) / tot) * 100);
    const perc2 = Math.round((Math.abs(val) / tot) * 100);
    // The 0.01 to 0.001 is a workaround for what appears to be a
    // CSS rendering bug on flat, transparent colors
    return (
      `linear-gradient(to right, rgba(0,0,0,0.01), rgba(0,0,0,0.001) ${perc1}%, ` +
      `rgba(${r},0,0,0.2) ${perc1}%, rgba(${r},0,0,0.2) ${perc1 + perc2}%, ` +
      `rgba(0,0,0,0.01) ${perc1 + perc2}%, rgba(0,0,0,0.001) 100%)`
    );
  }

  return (
    <div className="superset-legacy-chart-table" ref={rootElem}>
      <table className="table table-striped table-condensed table-hover dataTable"></table>
    </div>
  );
}
