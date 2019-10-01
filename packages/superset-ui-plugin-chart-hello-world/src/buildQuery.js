import { buildQueryContext } from '@superset-ui/query';

export default function buildQuery(formData) {
  // Set the single QueryObject's groupby field with series in formData
  return buildQueryContext(formData, baseQueryObject => {
    return [
      {
        ...baseQueryObject,
        groupby: [formData.series],
        metrics: [formData.metric],
      },
    ];
  });
}
