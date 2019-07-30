import { max as d3Max } from 'd3-array';
import { HierarchyRectangularNode } from 'd3-hierarchy';
import { IcicleEventNode } from '../../types/IcicleEventNode';

export function findDepth(node: IcicleEventNode, depth: number = 0): number {
  if (!node.children) {
    return depth;
  }

  const maxDepth = d3Max(node.children.map(child => findDepth(child, depth + 1)));

  return maxDepth || depth;
}

export function hierarchySort(
  a: HierarchyRectangularNode<IcicleEventNode>,
  b: HierarchyRectangularNode<IcicleEventNode>,
): number {
  if (a && a.value && b && b.value) {
    return b.value - a.value || b.height - a.height;
  }

  return 0;
}
