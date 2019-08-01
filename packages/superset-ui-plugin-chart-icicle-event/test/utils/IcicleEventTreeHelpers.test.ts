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
import { IcicleEventNode } from '../../types/IcicleEventNode';
import { findDepth } from '../../src/utils/IcicleEventTreeHelpers';

const ROOT_NODE: IcicleEventNode = {
  id: 'root',
  event: 'root',
  name: 'Root',
  value: 1,
};

const NODE_A: IcicleEventNode = {
  id: 'a-0',
  event: 'a',
  name: 'A',
  value: 1,
};

const NODE_B: IcicleEventNode = {
  id: 'b-0',
  event: 'b',
  name: 'B',
  value: 1,
};

const BALANCED_TREE: IcicleEventNode = {
  id: 'root',
  event: 'root',
  name: 'Root',
  value: 2,
  children: [NODE_A, NODE_B],
};

describe('findDepth', () => {
  it('finds depth of tree with root node', () => {
    expect(findDepth(ROOT_NODE)).toBe(0);
    expect(findDepth(BALANCED_TREE)).toBe(1);
  });
});
