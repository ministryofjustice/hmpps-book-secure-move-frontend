import { expect } from 'chai'
import sinon from 'sinon'

import { destinationDiffers } from './validators'

describe('Validators', function () {
  let clock: sinon.SinonFakeTimers

  beforeEach(function () {
    const now = new Date('2014-11-05T15:09:00Z')
    clock = sinon.useFakeTimers(now.getTime())
  })

  afterEach(function () {
    clock.restore()
  })

  describe('valid values', function () {
    it('should return false for matching location and destination ', function () {
      const context = { values: { destination: 'paris' } }
      expect(destinationDiffers.call(context, 'paris', 'destination')).to.be
        .false
    })

    it('should return true for different destinations', function () {
      const context = { values: { destination: 'paris' } }
      expect(destinationDiffers.call(context, 'london', 'destination')).to.be
        .true
    })
  })
})

