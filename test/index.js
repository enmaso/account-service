import http from 'http'
import assert from 'assert'

import '../src/index.js'

describe('Local Authentication Service', () => {
  it('should return 200', done => {
    http.get('http://localhost:8080/auth/status', res => {
      assert.equal(200, res.statusCode)
      done()
    })
  })
})
