import React from 'react';

interface Props {
  className?: string;
  children: React.ReactChild;
}

const defaultProps = {
  className: '',
};

const CONTAINER_STYLE = { padding: 8 };

class TooltipFrame extends React.PureComponent<Props, {}> {
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
