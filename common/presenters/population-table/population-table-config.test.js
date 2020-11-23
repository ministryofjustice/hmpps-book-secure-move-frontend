const { addDays } = require('date-fns')

const i18n = require('../../../config/i18n')

const populationTableConfig = require('./population-table-config')

describe('population-table-config', function () {
  let result
  let data
  let date
  let focusDate

  describe('establishmentConfig', function () {})

  describe('dayConfig', function () {
    let headSpy
    let rowSpy
    let date
    let focusDate
    let offsetDate

    beforeEach(function () {
      date = new Date('2020-07-01')
      offsetDate = new Date('2020-07-02')
      focusDate = new Date('2020-07-01')

      headSpy = sinon.spy(populationTableConfig, 'dayHeadConfig')
      rowSpy = sinon.spy(populationTableConfig, 'dayRowConfig')
    })

    afterEach(function () {
      headSpy.restore()
      rowSpy.restore()
    })

    context('with offset === 0', function () {
      beforeEach(function () {
        populationTableConfig.dayConfig({
          focusDate: focusDate,
          baseDate: date,
        })
      })

      it('should call headConfig with matching dates', function () {
        expect(headSpy).to.have.been.calledOnceWith({
          date: date,
          focusDate: focusDate,
        })
      })

      it('should call rowConfig with matching dates', function () {
        expect(rowSpy).to.have.been.calledOnceWith({
          date: date,
          focusDate: focusDate,
          populationIndex: 0,
        })
      })
    })

    context('with offset === 0', function () {
      beforeEach(function () {
        populationTableConfig.dayConfig({
          focusDate: focusDate,
          baseDate: date,
          baseOffset: 0,
        })
      })

      it('should call headConfig with matching dates', function () {
        expect(headSpy).to.have.been.calledOnceWith({
          date: date,
          focusDate: focusDate,
        })
      })

      it('should call rowConfig with matching dates', function () {
        expect(rowSpy).to.have.been.calledOnceWith({
          date: date,
          focusDate: focusDate,
          populationIndex: 0,
        })
      })
    })

    context('with offset === 1', function () {
      beforeEach(function () {
        populationTableConfig.dayConfig({
          focusDate: focusDate,
          baseDate: date,
          baseOffset: 1,
        })
      })

      it('should call headConfig with matching dates', function () {
        expect(headSpy).to.have.been.calledOnce
        expect(headSpy).to.have.been.calledWithMatch({
          date: offsetDate,
          focusDate: focusDate,
        })
      })

      it('should call rowConfig with matching dates', function () {
        expect(rowSpy).to.have.been.calledOnceWith({
          date: offsetDate,
          focusDate: focusDate,
          populationIndex: 1,
        })
      })
    })
  })

  describe('dayHeadConfig', function () {
    context('setting up', function () {
      beforeEach(function () {
        date = new Date('2020-07-01')
        focusDate = new Date('2020-07-01')
      })

      it('should have a text label', function () {
        const config = populationTableConfig.dayHeadConfig({
          date,
          focusDate,
        })

        expect(config.text).to.equal('Wed 01')
      })

      describe('with a matching date and focusDate', function () {
        it('should have focused styling', function () {
          const config = populationTableConfig.dayHeadConfig({
            date,
            focusDate,
          })

          expect(config.classes).to.equal(
            'focus-table__tr--day focus-table__tr--focus'
          )
        })
      })

      describe('with a different date and focusDate', function () {
        it('should not have focused styling', function () {
          focusDate = addDays(date, 1)
          const config = populationTableConfig.dayHeadConfig({
            date,
            focusDate,
          })

          expect(config.classes).to.equal('focus-table__tr--day')
        })
      })

      describe('with no focusDate', function () {
        it('should not have focused styling', function () {
          focusDate = addDays(date, 1)
          const config = populationTableConfig.dayHeadConfig({
            date,
            focusDate,
          })

          expect(config.classes).to.equal('focus-table__tr--day')
        })
      })
    })
  })

  describe('dayRowConfig', function () {
    context('setting up', function () {
      beforeEach(function () {
        date = new Date('2020-07-01')
        focusDate = new Date('2020-07-01')
      })

      it('should do have a html render function', function () {
        const config = populationTableConfig.dayRowConfig({
          date,
          focusDate,
        })

        expect(config.html).to.be.an.instanceOf(Function)
      })

      describe('with a matching date and focusDate', function () {
        it('should have focused styling', function () {
          const config = populationTableConfig.dayRowConfig({
            date,
            focusDate,
          })

          expect(config.classes).to.equal(
            'focus-table__td--day focus-table__td--focus'
          )
        })
      })

      describe('with a different date and focusDate', function () {
        it('should not have focused styling', function () {
          focusDate = addDays(date, 1)
          const config = populationTableConfig.dayRowConfig({
            date,
            focusDate,
          })

          expect(config.classes).to.equal('focus-table__td--day')
        })
      })

      describe('with no focusDate', function () {
        it('should not have focused styling', function () {
          focusDate = addDays(date, 1)
          const config = populationTableConfig.dayRowConfig({
            date,
          })

          expect(config.classes).to.equal('focus-table__td--day')
        })
      })
    })

    context('rendering row data', function () {
      let t

      beforeEach(function () {
        t = sinon.stub(i18n, 't').returnsArg(0)

        data = {
          meta: {
            populations: [
              {
                id: 'BEEFCAFE',
                free_spaces: 9,
              },
              {
                id: 'FEEDC0DE',
                free_spaces: -3,
              },
            ],
          },
        }

        date = new Date()
        focusDate = new Date()
      })

      afterEach(function () {
        t.restore()
      })

      context('with populationIndex === 0 ', function () {
        beforeEach(function () {
          const { html: renderFunction } = populationTableConfig.dayRowConfig({
            date,
            focusDate,
            populationIndex: 0,
          })

          result = renderFunction(data)
        })

        it('should call translate with correct population count', function () {
          expect(t).to.have.been.calledWith('population::spaces_with_count', {
            count: 9,
          })
        })

        it('should render with spaces with count', function () {
          expect(result).to.contain('>population::spaces_with_count<')
        })

        it('should use not use url with edit', function () {
          expect(result).not.to.contain('/edit">')
        })
      })

      context('with populationIndex === 1', function () {
        beforeEach(function () {
          const { html: renderFunction } = populationTableConfig.dayRowConfig({
            date,
            focusDate,
            populationIndex: 1,
          })

          result = renderFunction(data)
        })

        it('should call translate with correct population count', function () {
          expect(t).to.have.been.calledWith('population::spaces_with_count', {
            count: -3,
          })
        })

        it('should render with spaces with count', function () {
          expect(result).to.contain('>population::spaces_with_count<')
        })
      })

      context('with no populationIndex', function () {
        beforeEach(function () {
          const { html: renderFunction } = populationTableConfig.dayRowConfig({
            date,
            focusDate,
          })

          result = renderFunction(data)
        })

        it('should call translate with first population count', function () {
          expect(t).to.have.been.calledWith('population::spaces_with_count', {
            count: 9,
          })
        })

        it('should render with spaces with count', function () {
          expect(result).to.contain('>population::spaces_with_count<')
        })
      })

      context('with missing population data', function () {
        beforeEach(function () {
          data = {
            meta: {
              populations: [],
            },
          }

          const { html: renderFunction } = populationTableConfig.dayRowConfig({
            date,
            focusDate,
          })

          result = renderFunction(data)
        })

        it('should call translate with add_space', function () {
          expect(t).to.have.been.calledWith('population::add_space')
        })

        it('should render with spaces as Add Space', function () {
          expect(result).to.contain('>population::add_space<')
        })

        it('should use url with edit', function () {
          expect(result).to.contain('/edit">')
        })
      })

      context('with missing free_spaces', function () {
        beforeEach(function () {
          data = {
            meta: {
              populations: [
                {
                  id: 'BEEFCAFE',
                },
              ],
            },
          }

          const { html: renderFunction } = populationTableConfig.dayRowConfig({
            date,
            focusDate,
          })

          result = renderFunction(data)
        })

        it('should call translate with add_space', function () {
          expect(t).to.have.been.calledWith('population::add_space')
        })

        it('should render with spaces as Add Space', function () {
          expect(result).to.contain('>population::add_space<')
        })
      })
    })
  })
})
