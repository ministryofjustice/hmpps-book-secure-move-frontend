const breadcrumbs = require('./breadcrumbs')

describe('breadcrumbs middleware', function () {
  let nextSpy
  let resMock
  let init

  beforeEach(function () {
    nextSpy = sinon.spy()
    resMock = {}
  })

  describe('#init()', function () {
    beforeEach(function () {
      init = breadcrumbs.init()
    })

    it('should attach a method to the response object', function () {
      init({}, resMock, nextSpy)

      expect(resMock).to.have.property('breadcrumb')
      expect(resMock.breadcrumb).to.be.a('function')
      expect(nextSpy.calledOnce).to.be.true
    })
  })

  describe('res.breadcrumb()', function () {
    beforeEach(function () {
      init({}, resMock, nextSpy)
    })

    describe('when called with no arguments', function () {
      it('should return the breadcrumb', function () {
        expect(resMock.breadcrumb()).to.deep.equal([])
      })
    })

    describe('when called with 1 argument', function () {
      it('should set name', function () {
        resMock.breadcrumb('Name')

        expect(resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Name',
          },
        ])
      })
    })

    describe('when called with 2 arguments', function () {
      it('should set url and name', function () {
        resMock.breadcrumb('Name', '/sample-url')

        expect(resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Name',
            href: '/sample-url',
          },
        ])
      })
    })

    describe('when called with an object', function () {
      it('should add the object to breadcrumb', function () {
        resMock.breadcrumb({
          text: 'Name',
          href: '/sample-url',
        })

        expect(resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Name',
            href: '/sample-url',
          },
        ])
      })
    })

    describe('when called with an array of objects', function () {
      it('should add each object to breadcrumb', function () {
        resMock.breadcrumb([
          {
            name: 'First item',
            url: '/first-item',
          },
          {
            name: 'Second item',
            url: '/second-item',
          },
        ])

        expect(resMock.breadcrumb()).to.deep.equal([
          {
            name: 'First item',
            url: '/first-item',
          },
          {
            name: 'Second item',
            url: '/second-item',
          },
        ])
      })
    })
  })

  describe('res.removeBreadcrumb()', function () {
    describe('when removing last breadcrumb item', function () {
      beforeEach(function () {
        init({}, resMock, nextSpy)

        resMock.breadcrumb('Item one')
        resMock.breadcrumb('Item two')
        resMock.breadcrumb('Item three')

        resMock.removeBreadcrumb()
      })

      it('should only contain two items', function () {
        expect(resMock.breadcrumb()).to.have.length(2)
      })

      it('should only contain the correct items', function () {
        expect(resMock.breadcrumb()).to.deep.equal([
          { text: 'Item one' },
          { text: 'Item two' },
        ])
      })
    })

    describe('when breadcrumb middle breadcrumb items', function () {
      beforeEach(function () {
        init({}, resMock, nextSpy)

        resMock.breadcrumb('Item one')
        resMock.breadcrumb('Item two')
        resMock.breadcrumb('Item three')

        resMock.removeBreadcrumb()

        resMock.breadcrumb('Item four')
      })

      it('should only contain three items', function () {
        expect(resMock.breadcrumb()).to.have.length(3)
      })

      it('should only contain the correct items', function () {
        expect(resMock.breadcrumb()).to.deep.equal([
          { text: 'Item one' },
          { text: 'Item two' },
          { text: 'Item four' },
        ])
      })
    })
  })

  describe('setHome()', function () {
    let setHome
    beforeEach(function () {
      init = breadcrumbs.init()
      init({}, resMock, sinon.spy())

      setHome = breadcrumbs.setHome
    })

    describe('when called with no arguments', function () {
      beforeEach(function () {
        setHome()({}, resMock, nextSpy)
      })

      it('should set a default value for the home item', function () {
        expect(nextSpy.calledOnce).to.be.true
        expect(resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Home',
            href: '/',
            _home: true,
          },
        ])
      })
    })

    describe('when called with an object', function () {
      beforeEach(function () {
        setHome({
          text: 'Root',
          href: '/root',
        })({}, resMock, nextSpy)
      })

      it('should set the object as the home item', function () {
        expect(nextSpy.calledOnce).to.be.true
        expect(resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Root',
            href: '/root',
            _home: true,
          },
        ])
      })
    })

    describe('when home is already set', function () {
      beforeEach(function () {
        setHome()({}, resMock, nextSpy)
      })

      it('should update the home item', function () {
        setHome({
          text: 'Root',
          href: '/root',
        })({}, resMock, nextSpy)

        expect(nextSpy.calledTwice).to.be.true
        expect(resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Root',
            href: '/root',
            _home: true,
          },
        ])
      })
    })
  })
})
