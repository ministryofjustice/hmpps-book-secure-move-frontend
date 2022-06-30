const i18n = require('../../config/i18n').default

const presenter = require('./assessment-print-button')

describe('Presenters', function () {
  describe('#assessmentPrintButton', function () {
    let output
    let mockArgs

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      mockArgs = {
        baseUrl: '/base-url',
        canAccess: sinon.stub().returns(true),
        context: 'person_escort_record',
      }
    })

    context('without print permission', function () {
      beforeEach(function () {
        mockArgs.canAccess.withArgs('person_escort_record:print').returns(false)
        output = presenter(mockArgs)
      })

      it('should return blank', function () {
        expect(output).to.deep.equal('')
      })
    })

    context('with print permission', function () {
      beforeEach(function () {
        output = presenter(mockArgs)
      })

      it('should return the print button html', function () {
        expect(output).to.deep.equal(
          '\n      <p>\n        <a href="/base-url/print" class="app-icon app-icon--print">\n          actions::print_assessment\n        </a>\n      </p>\n    '
        )
      })
    })
  })
})
