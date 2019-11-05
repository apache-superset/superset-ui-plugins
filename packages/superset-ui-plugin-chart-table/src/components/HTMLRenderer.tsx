import React, { useMemo } from 'react';
import dompurify from 'dompurify';

export default function HTMLRenderer({ value }: { value: string }) {
  const memoizedHtml = useMemo(() => dompurify.sanitize(value), [value]);

  return (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: memoizedHtml }} />
  );
}
