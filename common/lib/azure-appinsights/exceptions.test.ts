import { expect } from 'chai'
import { ATTR_EXCEPTION_TYPE, ATTR_EXCEPTION_MESSAGE, ATTR_EXCEPTION_STACKTRACE } from '@opentelemetry/semantic-conventions'

import { errorToLogAttributes } from './exceptions'

describe('azure-appinsights/exceptions', function () {
  describe('#errorToLogAttributes()', function () {
    it('maps an Error instance to exception attributes', function () {
      const error = new TypeError('something broke')

      const attributes = errorToLogAttributes(error)

      expect(attributes[ATTR_EXCEPTION_TYPE]).to.equal('TypeError')
      expect(attributes[ATTR_EXCEPTION_MESSAGE]).to.equal('something broke')
      expect(attributes[ATTR_EXCEPTION_STACKTRACE]).to.equal(error.stack)
    })

    it('maps a string rejection reason', function () {
      const attributes = errorToLogAttributes('boom')

      expect(attributes[ATTR_EXCEPTION_TYPE]).to.equal('NonErrorRejection')
      expect(attributes[ATTR_EXCEPTION_MESSAGE]).to.equal('boom')
      expect(attributes[ATTR_EXCEPTION_STACKTRACE]).to.equal('boom')
    })

    it('maps a plain object rejection reason', function () {
      const attributes = errorToLogAttributes({ code: 'ECONNRESET' })

      expect(attributes[ATTR_EXCEPTION_TYPE]).to.equal('NonErrorRejection')
      expect(attributes[ATTR_EXCEPTION_MESSAGE]).to.equal('{"code":"ECONNRESET"}')
    })

    it('falls back to String() for a value that cannot be JSON stringified', function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circular: any = {}
      circular.self = circular

      const attributes = errorToLogAttributes(circular)

      expect(attributes[ATTR_EXCEPTION_TYPE]).to.equal('NonErrorRejection')
      expect(attributes[ATTR_EXCEPTION_MESSAGE]).to.equal('[object Object]')
    })
  })
})
