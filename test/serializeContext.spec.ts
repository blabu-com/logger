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
      extendedRandomData: 'qwertzuiop',
      ip: '127.0.0.1'
    })

    assert.strictEqual(c.extendedRandomData, undefined)
    assert.strictEqual(c.ip, '127.0.0.1')
  })
})
