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

  const maxes: { [key: string]: number } = {};
  const mins: { [key: string]: number } = {};
  const isMetric = (key: string) => metrics.includes(key);

  // Specify options for each data table columns
  // Ref: https://datatables.net/reference/option/columns
  const columnOptions = columns.map(({ key, label }) => {
    const vals = data.map(row => row[key]);
    const keyIsMetric = isMetric(key);
    let className = keyIsMetric ? 'dt-metric' : '';

    // collect min/max for for rendering bars
    if (keyIsMetric) {
      const nums = vals as number[];
      if (alignPositiveNegative) {
        maxes[key] = Math.max(...nums.map(Math.abs));
      } else {
        maxes[key] = Math.max(...nums);
        mins[key] = Math.min(...nums);
      }
    }

    return {
      key,
      className,
      title: label,
    };
  });

  const viewportHeight = Math.min(height, window.innerHeight);
  const pageLengthChoices = [10, 25, 40, 50, 75, 100, 150, 200];
  const options = {
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
    // force smaller pagination, because datatables-bs hard-corded pagination styles
    $('.pagination', rootElem.current as HTMLElement).addClass('pagination-sm');
  }

  /**
   * Formatted text for cell value
   */
  function cellText(key: string, format: string | undefined, val: unknown) {
    if (key === '__timestamp') {
      return formatTimestamp(val);
    } else if (typeof val === 'string') {
      // It's fine to return raw value react will handles HTML escaping
      return val;
    } else if (isMetric(key)) {
      // default format '' will return human readable numbers (e.g. 50M, 33k)
      return getNumberFormatter(format || '')(val as number);
    } else if (key[0] === '%') {
      return formatPercent(val);
    }
    return val;
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
      <table className="table table-striped table-condensed table-hover dataTable">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, i) => (
            <tr key={i}>
              {columns.map(({ key, format }) => {
                const val = record[key];
                return (
                  <td
                    key={key}
                    data-sort={val}
                    className={isMetric(key) ? 'text-right' : ''}
                    style={{
                      backgroundImage: typeof val === 'number' ? cellBar(key, val) : undefined,
                    }}
                  >
                    {cellText(key, format, val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
