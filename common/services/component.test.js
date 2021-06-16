const proxyquire = require('proxyquire').noCallThru()

function nunjucksStub() {
  return {
    renderString: sinon.stub().returnsArg(0),
  }
}

const componentService = proxyquire('./component', {
  '../../config/nunjucks': nunjucksStub,
})
const params = {
  foo: 'bar',
  fizz: 'buzz',
}

describe('Component Service', function () {
  describe('#getComponent()', function () {
    context('with GOV.UK Design System component', function () {
      let component

      beforeEach(function () {
        component = componentService.getComponent('govukInput', params)
      })

      it('should use correct filename', function () {
        expect(component).to.contain('from "govuk/components/input/macro.njk"')
      })

      it('should use correct macro name', function () {
        expect(component).to.contain('import govukInput')
      })

      it('should format params', function () {
        expect(component).to.contain(
          `govukInput(${JSON.stringify(params, null, 2)})`
        )
      })
    })

    context('with MOJ Design System component', function () {
      let component

      beforeEach(function () {
        component = componentService.getComponent('mojBadge', params)
      })

      it('should use correct filename', function () {
        expect(component).to.contain('from "moj/components/badge/macro.njk"')
      })

      it('should use correct macro name', function () {
        expect(component).to.contain('import mojBadge')
      })

      it('should format params', function () {
        expect(component).to.contain(
          `mojBadge(${JSON.stringify(params, null, 2)})`
        )
      })
    })

    context('with app component', function () {
      let component

      beforeEach(function () {
        component = componentService.getComponent('appData', params)
      })

      it('should use correct filename', function () {
        expect(component).to.contain('from "data/macro.njk"')
      })

      it('should use correct macro name', function () {
        expect(component).to.contain('import appData')
      })

      it('should format params', function () {
        expect(component).to.contain(
          `appData(${JSON.stringify(params, null, 2)})`
        )
      })
    })

    context('with multi word component', function () {
      let component

      beforeEach(function () {
        component = componentService.getComponent('appErrorSummary', params)
      })

      it('should use correct filename', function () {
        expect(component).to.contain('from "error-summary/macro.njk"')
      })

      it('should use correct macro name', function () {
        expect(component).to.contain('import appErrorSummary')
      })

      it('should format params', function () {
        expect(component).to.contain(
          `appErrorSummary(${JSON.stringify(params, null, 2)})`
        )
      })
    })
  })
})
