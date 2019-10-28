import { QueryFormDataMetric, AdhocMetric } from '@superset-ui/query';
import { createSelector } from 'reselect';
import { ParentRow } from '@airbnb/lunar/lib/components/DataTable/types';
import { PlainObject } from './types';

type inputType = {
  timeseriesLimitMetric: QueryFormDataMetric;
  orderDesc: boolean;
  records: PlainObject[];
  metrics: string[];
};

function processData(
  timeseriesLimitMetric: QueryFormDataMetric,
  orderDesc: boolean,
  records: PlainObject[],
  metrics: string[],
) {
  const sortByKey =
    timeseriesLimitMetric &&
    ((timeseriesLimitMetric as AdhocMetric).label || (timeseriesLimitMetric as string));

  let processedRecords = records;

  if (sortByKey) {
    processedRecords = records
      .slice()
      .sort(
        orderDesc ? (a, b) => b[sortByKey] - a[sortByKey] : (a, b) => a[sortByKey] - b[sortByKey],
      );
  }

  return processedRecords.map(
    sortByKey && metrics.indexOf(sortByKey) < 0
      ? row => {
          const data = { ...row };
          delete data[sortByKey];

          return { data };
        }
      : row => ({ data: row }),
  );
}

export default createSelector<
  inputType,
  QueryFormDataMetric,
  boolean,
  PlainObject[],
  string[],
  ParentRow[]
>(
  data => data.timeseriesLimitMetric,
  data => data.orderDesc,
  data => data.records,
  data => data.metrics,
  (timeseriesLimitMetric, orderDesc, records, metrics) =>
    processData(timeseriesLimitMetric, orderDesc, records, metrics),
);
