import React, { useMemo } from 'react';
import dompurify from 'dompurify';

export default function HTMLRenderer({ value }: { value: string }) {
  const memoizedHtml = useMemo(() => ({ __html: dompurify.sanitize(value) }), [value]);

  return (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={memoizedHtml} />
  );
}
