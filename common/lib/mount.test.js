const path = require('path')

const proxyquire = require('proxyquire')

const use = sinon.stub().returnsArg(0)
const express = {
  Router: sinon.stub().returns({ use }),
}

const mount = proxyquire('./mount', {
  express,
})

const mountPath = testpath =>
  mount(path.resolve(__dirname, `../../test/fixtures/mount/${testpath}`))

describe('subapp mounter', function () {
  let mounts
  beforeEach(function () {
    express.Router.resetHistory()
    use.resetHistory()
  })

  describe('when there is a subapp', function () {
    beforeEach(function () {
      mounts = mountPath('default')
    })

    it('should use the subapp', function () {
      expect(use).to.be.calledOnceWithExactly('app1')
    })

    it('should return the used middleware', function () {
      expect(mounts).to.deep.equal(['app1'])
    })
  })

  describe('when there is a subapp with a mountpath', function () {
    beforeEach(function () {
      mounts = mountPath('mountpath')
    })

    it('should use the subapp', function () {
      expect(use).to.be.calledOnceWithExactly('/app1', 'app1')
    })

    it('should return the used middleware', function () {
      expect(mounts).to.deep.equal(['/app1'])
    })
  })

  describe('when there are multiple subapps', function () {
    beforeEach(function () {
      mounts = mountPath('multiple')
    })

    it('should use the subapp', function () {
      expect(use.callCount).to.equal(2)
      expect(use).to.be.calledWithExactly('app1')
      expect(use).to.be.calledWithExactly('app2')
    })

    it('should return the used middleware', function () {
      expect(mounts).to.deep.equal(['app1', 'app2'])
    })
  })

  describe('when there is a skippable subapp', function () {
    beforeEach(function () {
      mounts = mountPath('skip')
    })

    it('should only use the non-skipped subapps', function () {
      expect(use).to.be.calledOnceWithExactly('app2')
    })

    it('should return the used middleware', function () {
      expect(mounts).to.deep.equal(['app2'])
    })
  })

  describe('when there is a missing router', function () {
    beforeEach(function () {
      mounts = mountPath('missing')
    })

    it('should only use the non-missing subapps', function () {
      expect(use).to.be.calledOnceWithExactly('app2')
    })

    it('should return the used middleware', function () {
      expect(mounts).to.deep.equal(['app2'])
    })
  })

  describe('when there are no subapps', function () {
    beforeEach(function () {
      mounts = mountPath('empty')
    })

    it('should not attempt to use any subapps', function () {
      expect(use).to.not.be.called
    })

    it('should return a noop middleware', function () {
      const next = sinon.stub()
      mounts('req', 'res', next)
      expect(next).to.be.calledOnceWithExactly()
    })
  })
})
