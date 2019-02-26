import React from 'react';
import { isDefined } from '@superset-ui/core';

function checkNumber(input: any): input is number {
  return isDefined(input) && typeof input === 'number';
}

export default class ChartFrame extends React.PureComponent<
  {
    contentWidth?: number;
    contentHeight?: number;
    height: number;
    renderContent: ({ height, width }: { height: number; width: number }) => React.ReactElement;
    width: number;
  },
  {}
> {
  static defaultProps = {
    renderContent() {},
  };

  render() {
    const { contentWidth, contentHeight, width, height, renderContent } = this.props;

    const overflowX = checkNumber(contentWidth) && contentWidth > width;
    const overflowY = checkNumber(contentHeight) && contentHeight > height;

    if (overflowX || overflowY) {
      return (
        <div
          style={{
            height,
            overflowX: overflowX ? 'scroll' : 'hidden',
            overflowY: overflowY ? 'scroll' : 'hidden',
            width,
          }}
        >
          {renderContent({
            height: Math.max(contentHeight || 0, height),
            width: Math.max(contentWidth || 0, width),
          })}
        </div>
      );
    }

    return renderContent({ height, width });
  }
}
