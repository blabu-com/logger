/* eslint-env node, mocha */

import { serializeContext } from '../serializeContext'
import * as assert from 'assert'

describe('serialize context', () => {
  it('eliminates unallowed props', () => {
    const c = serializeContext({
      user: 'User',
      headers: {
        header: 'value'
      },
      extendedRandomData: 'qwertzuiop'
    })

    assert.strictEqual(c.extendedRandomData, undefined)
  })
})
