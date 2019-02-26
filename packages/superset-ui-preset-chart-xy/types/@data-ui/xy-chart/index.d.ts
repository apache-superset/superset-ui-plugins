declare module '@data-ui/xy-chart' {
  import React from 'react';

  export class XAxis extends React.PureComponent<
    {
      [key: string]: any;
    },
    {}
  > {}
  // eslint-disable-next-line react/no-multi-comp
  export class YAxis extends React.PureComponent<
    {
      [key: string]: any;
    },
    {}
  > {}
}
