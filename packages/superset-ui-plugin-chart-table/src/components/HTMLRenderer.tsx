import React, { useMemo } from 'react';
import dompurify from 'dompurify';

const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

export default function HTMLRenderer({ value }: { value: string }) {
  const html = useMemo(() => ({ __html: dompurify.sanitize(value) }), [value]);

  if (isHTML(value)) {
    return (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={html} />
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{value}</>;
}
