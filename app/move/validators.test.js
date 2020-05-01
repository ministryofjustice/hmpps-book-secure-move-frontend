const validators = require('./validators')

describe('Validators', function() {
  let clock

  beforeEach(function() {
    const now = new Date('2014-11-05T15:09:00Z')
    clock = sinon.useFakeTimers(now.getTime())
  })

  afterEach(function() {
    clock.restore()
  })

  describe('#time()', function() {
    describe('invalid values', function() {
      const inputs = [
        10,
        null,
        '10',
        '25:00',
        '10:65',
        'asdf',
        '10:00a',
        '9:00p',
        '9pm',
        '7am',
        'midnight',
        'midday',
      ]

      inputs.forEach(i => {
        it(`test for: "${i}"`, function() {
          expect(validators.time(i)).not.to.be.ok
        })
      })
    })

    describe('valid values', function() {
      const inputs = [
        '',
        '9:00am',
        '9:00pm',
        '9:00',
        '10:00',
        '10:30',
        '10:00am',
        '10:00pm',
        '22:00',
      ]

      inputs.forEach(i => {
        it(`test for: "${i}"`, function() {
          expect(validators.time(i)).to.be.ok
        })
      })
    })
  })

  describe('#datetime()', function() {
    describe('invalid values', function() {
      const inputs = [
        10,
        null,
        '25:00',
        '2010-10-10T10:65',
        'asdf',
        '10:00a',
        '2010-10-10:9:00p',
        '20-10-10T10:00Z',
        '2020-20-10T10:00Z',
        '2020-10-40T10:00Z',
        'midnight',
        'midday',
      ]

      inputs.forEach(i => {
        it(`test for: "${i}"`, function() {
          expect(validators.datetime(i)).not.to.be.ok
        })
      })
    })

    describe('valid values', function() {
      const inputs = [
        '',
        '2010-10-10T10:00Z',
        '2010-10-10T10:00+01:00',
        '2010-10-10T10:00-10:00',
      ]

      inputs.forEach(i => {
        it(`test for: "${i}"`, function() {
          expect(validators.datetime(i)).to.be.ok
        })
      })
    })
  })

  describe('after', function() {
    // note date is set to 2014-11-05T15:09:00Z in all tests

    describe('invalid values', function() {
      const inputs = [
        '2014-11-05',
        ['2014-12-16', '2014-12-16'],
        ['2013-12-15', '2013-12-16'],
      ]

      inputs.forEach(i => {
        it(`test for: "${i}"`, function() {
          if (typeof i === 'string') {
            expect(validators.after(i)).not.to.be.ok
          } else {
            expect(validators.after.apply(null, i)).not.to.be.ok
          }
        })
      })
    })

    describe('valid inputs', function() {
      const inputs = [
        ['', '2014-12-15'],
        ['2014-12-16', '2014-12-15'],
        ['2014-12-16T00:00Z', '2014-12-15T00:00Z'],
        ['2014-12-16T12:00+01:00', '2014-12-16T11:59+02:00'],
      ]

      inputs.forEach(i => {
        it(`test for: "${i}"`, function() {
          expect(validators.after.apply(null, i)).to.be.ok
        })
      })
    })
  })
})
