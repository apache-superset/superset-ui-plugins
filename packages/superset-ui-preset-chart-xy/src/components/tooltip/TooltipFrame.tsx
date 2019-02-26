import React from 'react';

const defaultProps = {
  className: '',
};

const CONTAINER_STYLE = { padding: 8 };

class TooltipFrame extends React.PureComponent<
  {
    className?: string;
    children: React.ReactChild;
  },
  {}
> {
  static defaultProps = defaultProps;

  render() {
    const { className, children } = this.props;

    return (
      <div className={className} style={CONTAINER_STYLE}>
        {children}
      </div>
    );
  }
}

export default TooltipFrame;
