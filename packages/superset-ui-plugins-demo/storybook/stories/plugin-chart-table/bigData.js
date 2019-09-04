/* eslint-disable no-unused-vars */
/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
const longString = `The quick brown fox jumps over the lazy dog`;
const shortString = 'Superset';

const rowCount = 30;
const columnCount = 20;

export const keys = Array(columnCount)
  .fill(0)
  .map((_, i) => `Column Name ${i}`);

const item = {};
keys.forEach(key => {
  item[key] = Math.random() < 0.5 ? longString : shortString;
});

export default Array(rowCount)
  .fill(0)
  .map(_ => ({ ...item }));
