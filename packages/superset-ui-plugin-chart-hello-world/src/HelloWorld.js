import { extent as d3Extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import cloudLayout from 'd3-cloud';
import { CategoricalColorNamespace } from '@superset-ui/color';

function HelloWorld(element, props) {
  const { data, width, height, formData } = props;

  const container = d3Select(element);
  container.select('*').remove();
  const div = container
    .append('div')
    .style('height', height)
    .style('width', width)
    .style('overflow', 'auto');
  div
    .append('h1')
    .text('Hello World')
    .append('h3')
    .text('props')
    .append('pre')
    .text(JSON.stringify(props, null, 2));
}

HelloWorld.displayName = 'HelloWorld';

export default HelloWorld;
