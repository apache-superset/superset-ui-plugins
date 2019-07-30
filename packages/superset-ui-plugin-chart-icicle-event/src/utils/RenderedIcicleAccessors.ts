import { HierarchyRectangularNode } from 'd3-hierarchy';
import { IcicleEventNode } from '../../types/IcicleEventNode';

export function x0(isVertical: boolean, d: HierarchyRectangularNode<IcicleEventNode>) {
  return isVertical ? d.y0 : d.x0;
}

export function x1(isVertical: boolean, d: HierarchyRectangularNode<IcicleEventNode>) {
  return isVertical ? d.y1 : d.x1;
}

export function y0(isVertical: boolean, d: HierarchyRectangularNode<IcicleEventNode>) {
  return isVertical ? d.x0 : d.y0;
}

export function y1(isVertical: boolean, d: HierarchyRectangularNode<IcicleEventNode>) {
  return isVertical ? d.x1 : d.y1;
}

export function rectWidth(
  isVertical: boolean,
  boxMargin: { x: number; y: number },
  d: HierarchyRectangularNode<IcicleEventNode>,
) {
  return Math.max(0, y1(isVertical, d) - y0(isVertical, d) - boxMargin.y * 2);
}

export function rectHeight(
  isVertical: boolean,
  boxMargin: { x: number; y: number },
  d: HierarchyRectangularNode<IcicleEventNode>,
) {
  return Math.max(
    0,
    x1(isVertical, d) -
      x0(isVertical, d) -
      (Math.min(1, (x1(isVertical, d) - x0(isVertical, d)) / 2) + boxMargin.x * 2),
  );
}
