const createSteps = require('../new/steps')

const controllers = require('./controllers')
const steps = require('./steps')

describe('Assign steps', function () {
  describe('/person-lookup-results', function () {
    it('should go to the transfer reason step', function () {
      expect(steps['/person-lookup-results'].next).to.equal('transfer-reason')
    })
  })

  describe('/transfer-reason', function () {
    const step = steps['/transfer-reason']

    it('should use the create move transfer reason fields', function () {
      expect(step.fields).to.deep.equal(createSteps['/transfer-reason'].fields)
    })

    it('should use the create move transfer reason page title', function () {
      expect(step.pageTitle).to.equal(createSteps['/transfer-reason'].pageTitle)
    })

    it('should use the assign prison transfer reason controller', function () {
      expect(step.controller).to.equal(controllers.PrisonTransferReason)
    })

    it('should go to the agreement status step', function () {
      expect(step.next).to.equal('agreement-status')
    })
  })
})
