const filters = require('../../common/controllers/filters')
const fieldHelpers = require('../../common/helpers/field')
const request = require('../../common/lib/request')

const {
  applyFilters,
  setFiltersInputs,
  renderFiltersInputs,
} = require('./controllers')

describe('Filters view controllers', function () {
  let fields
  let req
  let res
  let next
  beforeEach(function () {
    sinon
      .stub(filters, 'removeDefaultFilterValues')
      .returns({ removeDefaultFilterValues: 'true' })
    sinon
      .stub(filters, 'getReferrerValues')
      .returns({ getReferrerValues: ['true'] })
    sinon
      .stub(filters, 'getDefaultValues')
      .returns({ getDefaultValues: 'true' })
    sinon
      .stub(fieldHelpers, 'processFields')
      .returns({ processedFields: 'true' })
    sinon.stub(request, 'getUrl').returns('/mockUrl')

    fields = {
      filterA: {},
    }
    req = {
      query: {
        foo: 'bar',
        referrer: '/foo',
      },
      body: {
        referrer: '/foo',
      },
    }
    res = {
      locals: {},
      redirect: sinon.stub(),
      render: sinon.stub(),
    }
    next = sinon.stub()
  })

  describe('#applyFilters()', function () {
    context('when applying updated filter values', function () {
      beforeEach(function () {
        applyFilters(fields)(req, res, next)
      })
      it('should call getUrl with correct args', function () {
        expect(request.getUrl).to.be.calledOnceWithExactly('/foo', {
          removeDefaultFilterValues: 'true',
        })
      })
      it('should redirect to correct url', function () {
        expect(res.redirect).to.be.calledOnceWithExactly('/mockUrl')
      })
      it('should not call next', function () {
        expect(next).to.not.be.called
      })
    })
  })

  describe('#setFiltersInputs()', function () {
    context('when setting filter input values', function () {
      beforeEach(function () {
        setFiltersInputs(fields)(req, res, next)
      })

      it('should remove default filter values', function () {
        expect(filters.removeDefaultFilterValues).to.be.calledOnceWithExactly(
          fields,
          {
            foo: 'bar',
          }
        )
      })

      it('should get referrer values', function () {
        expect(filters.getReferrerValues).to.be.calledOnceWithExactly(fields, {
          removeDefaultFilterValues: 'true',
        })
      })

      it('should get default values', function () {
        expect(filters.getDefaultValues).to.be.calledOnceWithExactly(fields)
      })
      it('should get processed fields', function () {
        expect(fieldHelpers.processFields).to.be.calledOnceWithExactly(fields, {
          getDefaultValues: 'true',
          removeDefaultFilterValues: 'true',
        })
      })

      it('should get default values', function () {
        expect(request.getUrl).to.be.calledOnceWithExactly('/foo', {
          removeDefaultFilterValues: 'true',
        })
      })

      it('should set the correct properties on the locals object', function () {
        expect(res.locals).to.deep.equal({
          cancelUrl: '/mockUrl',
          filters: {
            components: {
              processedFields: 'true',
            },
            referrer: {
              url: '/foo',
              values: {
                getReferrerValues: ['true'],
              },
            },
          },
        })
      })
      it('should not call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#renderFiltersInputs()', function () {
    context('when rendering filter input', function () {
      beforeEach(function () {
        renderFiltersInputs(req, res, next)
      })
      it('should render correct template', function () {
        expect(res.render).to.be.calledOnceWithExactly(
          'filters/views/filters.njk'
        )
      })
      it('should not call next', function () {
        expect(next).to.not.be.called
      })
    })
  })
})
