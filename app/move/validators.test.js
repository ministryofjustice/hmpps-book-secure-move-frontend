const validators = require('./validators')

describe('Validators', function() {
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
})
