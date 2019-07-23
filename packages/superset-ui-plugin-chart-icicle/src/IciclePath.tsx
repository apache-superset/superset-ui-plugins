import React, { PureComponent } from 'react';
import { HierarchyRectangularNode } from 'd3-hierarchy';
import { IcicleNode } from '../types/IcicleNode';

type Props = {
  color: (name: string) => string;
  focusNode: HierarchyRectangularNode<IcicleNode>;
  setFocusById: (id: string) => void;
};

const defaultProps = {
  color: (name: string) => 'pink',
  focusNode: undefined,
  setFocusById: (id: string) => console.log('[setFocusById] id: ', id),
};

export default class IciclePath extends PureComponent<Props> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
  }

  // Extract the path up to the parent from the focused node to display
  // path & allow for zooming in/out
  extractPathFromNode(node: HierarchyRectangularNode<IcicleNode>) {}

  render() {
    return <div>Icicle Path</div>;
  }
}
