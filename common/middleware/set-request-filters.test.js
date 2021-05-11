const proxyquire = require('proxyquire')

const filtersToCategoriesListStub = sinon.stub().returns(['fake_categories'])

const setRequestFilters = proxyquire('./set-request-filters', {
  '../presenters/filters-to-categories-list-component':
    filtersToCategoriesListStub,
})

describe('#setRequestFilters()', function () {
  let req, res, next
  const fields = {
    filterA: {
      defaultValue: 'skippit',
    },
  }

  beforeEach(function () {
    filtersToCategoriesListStub.resetHistory()
    req = {
      originalUrl: '/foo',
      query: {},
    }
    res = { locals: {} }
    next = sinon.stub()
  })

  context('when passed no args for the referrer', function () {
    beforeEach(function () {
      setRequestFilters(fields)(req, res, next)
    })
    it('should call filters to categories list component correctly', function () {
      expect(filtersToCategoriesListStub).to.be.calledOnceWithExactly(
        fields,
        {},
        '/foo'
      )
    })
    it('should set the requestFilters prop on locals object correctly', function () {
      expect(res.locals.requestFilters).to.deep.equal({
        categories: ['fake_categories'],
        links: {
          editFilters: '/filters?referrer=%2Ffoo',
          clearFilters: undefined,
        },
      })

      expect(next).to.be.calledOnceWithExactly()
    })
  })

  context('when passed args for the referrer', function () {
    beforeEach(function () {
      req.query = {
        foo: 'bar',
      }
      setRequestFilters(fields)(req, res, next)
    })
    it('should call filters to categories list component correctly', function () {
      expect(filtersToCategoriesListStub).to.be.calledOnceWithExactly(
        fields,
        { foo: 'bar' },
        '/foo'
      )
    })
    it('should set the requestFilters prop on locals object correctly', function () {
      expect(res.locals.requestFilters).to.deep.equal({
        categories: ['fake_categories'],
        links: {
          editFilters: '/filters?foo=bar&referrer=%2Ffoo',
          clearFilters: undefined,
        },
      })

      expect(next).to.be.calledOnceWithExactly()
    })
  })

  context('when passed args for the referrer', function () {
    beforeEach(function () {
      req.query = {
        foo: 'bar',
        filterA: 'x',
      }
      setRequestFilters(fields)(req, res, next)
    })
    it('should call filters to categories list component correctly', function () {
      expect(filtersToCategoriesListStub).to.be.calledOnceWithExactly(
        fields,
        { foo: 'bar', filterA: 'x' },
        '/foo'
      )
    })
    it('should set the requestFilters prop on locals object correctly', function () {
      expect(res.locals.requestFilters).to.deep.equal({
        categories: ['fake_categories'],
        links: {
          editFilters: '/filters?foo=bar&filterA=x&referrer=%2Ffoo',
          clearFilters: '/foo?foo=bar',
        },
      })

      expect(next).to.be.calledOnceWithExactly()
    })
  })

  context('when passed args with default filter values', function () {
    beforeEach(function () {
      req.query = {
        foo: 'bar',
        filterA: 'skippit',
      }
      setRequestFilters(fields)(req, res, next)
    })
    it('should call filters to categories list component correctly', function () {
      expect(filtersToCategoriesListStub).to.be.calledOnceWithExactly(
        fields,
        { foo: 'bar' },
        '/foo'
      )
    })
    it('should set the requestFilters prop on locals object correctly', function () {
      expect(res.locals.requestFilters).to.deep.equal({
        categories: ['fake_categories'],
        links: {
          editFilters: '/filters?foo=bar&referrer=%2Ffoo',
          clearFilters: undefined,
        },
      })

      expect(next).to.be.calledOnceWithExactly()
    })
  })

  context('when passed an explicit base url', function () {
    beforeEach(function () {
      setRequestFilters(fields, '/bar')(req, res, next)
    })

    it('should set the requestFilters prop on locals object correctly', function () {
      expect(res.locals.requestFilters).to.deep.equal({
        categories: ['fake_categories'],
        links: {
          editFilters: '/bar?referrer=%2Ffoo',
          clearFilters: undefined,
        },
      })

      expect(next).to.be.calledOnceWithExactly()
    })
  })
})
