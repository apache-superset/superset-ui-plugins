/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { mount } from 'enzyme';
import ReactDataTable from '../src/ReactDataTable';
import transformProps from '../src/transformProps';
import * as testData from './test_data';

describe('legacy-table', () => {
  // Can test more prop transformation here. Not needed for now.
  describe('transformProps', () => {});

  describe('ReactDataTable', () => {
    // Jest throw an error at `console.warn`, this disables that behavior
    beforeAll(() => {
      console.warn = console.log;
    });
    afterAll(() => {
      console.warn = console.error;
    });

    let wrap: any; // the SuperChart wraper
    let tree: any; // helper to dive into DOM tree

    it('render basic data', () => {
      wrap = mount(<ReactDataTable {...transformProps(testData.basic)} />);
      tree = wrap.render(); // returns a CheerioWrapper with jQuery-like API
      expect(tree.hasClass('superset-legacy-chart-table')).toEqual(true);
      expect(tree.find('td[data-sort="Michael"]')).toHaveLength(1);
    });

    it('render advanced data', () => {
      // should successfull rerender with new props
      wrap.setProps(transformProps(testData.advanced));
      tree = wrap.render();
      const text = tree.text();
      expect(text).toContain('Sum of Num');
      expect(text).toContain('12.346%');
    });
  });
});
