import { expect } from 'chai'
import sinon from 'sinon'
import { performance } from 'perf_hooks'

import { getCpuPercent } from './performance'

describe('azure-appinsights/performance', function () {
  describe('#getCpuPercent()', function () {
    let cpuUsageStub: sinon.SinonStub
    let performanceNowStub: sinon.SinonStub

    beforeEach(function () {
      cpuUsageStub = sinon.stub(process, 'cpuUsage')
      performanceNowStub = sinon.stub(performance, 'now')
    })

    afterEach(function () {
      cpuUsageStub.restore()
      performanceNowStub.restore()
    })

    it('returns the percentage of elapsed time spent on CPU', function () {
      // getCpuPercent()'s lastCpuUsage/lastSampleTime are seeded at module import time, before
      // these stubs exist - prime them onto stub-controlled values with a throwaway call first.
      cpuUsageStub.returns({ user: 0, system: 0 })
      performanceNowStub.returns(0)
      getCpuPercent()

      // 500ms of user+system CPU time over a 1000ms wall-clock window = 50%
      cpuUsageStub.returns({ user: 300_000, system: 200_000 })
      performanceNowStub.returns(1000)

      expect(getCpuPercent()).to.equal(50)
    })

    it('returns 0 when no time has elapsed since the last sample', function () {
      cpuUsageStub.returns({ user: 0, system: 0 })
      performanceNowStub.returns(500)
      getCpuPercent()

      performanceNowStub.returns(500)

      expect(getCpuPercent()).to.equal(0)
    })
  })
})
