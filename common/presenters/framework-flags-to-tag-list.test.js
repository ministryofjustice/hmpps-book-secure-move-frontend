const proxyquire = require('proxyquire')

const mockFlagSettings = {
  alert: {
    tagClass: 'app-tag--destructive',
    sortOrder: 1,
  },
  warning: {
    tagClass: 'app-tag--warning',
    sortOrder: 2,
  },
  attention: {
    tagClass: '',
    sortOrder: 3,
  },
}

const presenter = proxyquire('./framework-flags-to-tag-list', {
  '../../config': {
    FRAMEWORKS: {
      FLAG_SETTINGS: mockFlagSettings,
    },
  },
})

describe('Presenters', function () {
  describe('#frameworkFlagsToTagList()', function () {
    let output

    context('without args', function () {
      beforeEach(function () {
        output = presenter()
      })

      it('should return empty array', function () {
        expect(output).to.deep.equal([])
      })
    })

    context('with args', function () {
      context('with flags', function () {
        const mockFlags = [
          {
            title: 'Escape risk',
            flag_type: 'alert',
          },
          {
            title: 'Foo bar',
            flag_type: 'attention',
          },
          {
            title: 'Pregnant',
            flag_type: 'warning',
          },
          {
            title: 'Climber',
            flag_type: 'alert',
          },
          {
            title: 'Vehicle',
            flag_type: 'warning',
          },
          {
            title: 'Mystery',
            flag_type: '__unknown_cat__',
          },
        ]

        beforeEach(function () {
          output = presenter(mockFlags)
        })

        it('should order items correctly', function () {
          const titles = output.map(it => it.text)
          expect(titles).to.deep.equal([
            'Climber',
            'Escape risk',
            'Pregnant',
            'Vehicle',
            'Foo bar',
            'Mystery',
          ])
        })

        it('should set hrefs correctly', function () {
          const hrefs = output.map(it => it.href)
          expect(hrefs).to.deep.equal([
            '#climber',
            '#escape-risk',
            '#pregnant',
            '#vehicle',
            '#foo-bar',
            '#mystery',
          ])
        })

        it('should set classes correctly', function () {
          const classes = output.map(it => it.classes)
          expect(classes).to.deep.equal([
            'app-tag--destructive',
            'app-tag--destructive',
            'app-tag--warning',
            'app-tag--warning',
            '',
            '',
          ])
        })

        it('should set order correctly', function () {
          const order = output.map(it => it.sortOrder)
          expect(order).to.deep.equal([1, 1, 2, 2, 3, null])
        })

        it('should not set sections', function () {
          output.forEach(item => {
            expect(item.section).to.be.undefined
          })
        })

        it('should contain correct number of keys', function () {
          output.forEach(item => {
            expect(Object.keys(item)).to.have.length(5)
          })
        })
      })

      context('with hrefPrefix', function () {
        const mockFlags = [
          {
            title: 'Escape risk',
            flag_type: 'alert',
          },
        ]
        const mockPrefix = '/prefix'

        beforeEach(function () {
          output = presenter(mockFlags, mockPrefix)
        })

        it('href should include prefix', function () {
          expect(output[0].href).to.equal('/prefix#escape-risk')
        })
      })

      context('with question', function () {
        const mockFlags = [
          {
            title: 'Escape risk',
            flag_type: 'alert',
            question: {
              section: 'section-one',
            },
          },
        ]

        beforeEach(function () {
          output = presenter(mockFlags)
        })

        it('href should include prefix', function () {
          expect(output[0].section).to.equal('section-one')
        })
      })
    })
  })
})
