import React, { useMemo } from 'react';
import dompurify from 'dompurify';

export default function HTMLRenderer({ value }: { value: string }) {
  if (!value.includes('<') || value.includes('>')) {
    return <div>{value}</div>;
  }

  const html = useMemo(() => ({ __html: dompurify.sanitize(value) }), [value]);

  return (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={html} />
  );
}
