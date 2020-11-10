const {
  isNonObject,
  isSkippableObject,
  isUnpopulatedObject,
} = require('./find-unpopulated-resources.checks')

describe('findUnpopulatedResources checks', function () {
  describe('#isNonObject', function () {
    context('when input is object', function () {
      it('should return false', function () {
        expect(isNonObject({})).to.equal(false)
      })
    })

    context('when input is undefined', function () {
      it('should return false', function () {
        expect(isNonObject(null)).to.equal(true)
      })
    })

    context('when input is null', function () {
      it('should return false', function () {
        expect(isNonObject(null)).to.equal(true)
      })
    })

    context('when input is string', function () {
      it('should return false', function () {
        expect(isNonObject('foo')).to.equal(true)
      })
    })

    context('when input is number', function () {
      it('should return false', function () {
        expect(isNonObject(23)).to.equal(true)
      })
    })

    context('when input is array', function () {
      it('should return false', function () {
        expect(isNonObject([])).to.equal(true)
      })
    })
  })

  describe('#isSkippableObject', function () {
    const obj = { type: 'foo' }

    context('when no options set', function () {
      it('should return false', function () {
        expect(isSkippableObject(obj)).to.equal(false)
      })
    })

    context('when object type is explicitly included', function () {
      it('should return true', function () {
        expect(isSkippableObject(obj, { include: ['foo'] })).to.equal(false)
      })
    })

    context('when object type is not explicitly included', function () {
      it('should return true', function () {
        expect(isSkippableObject(obj, { include: ['bar'] })).to.equal(true)
      })
    })

    context('when object type is excluded', function () {
      it('should return true', function () {
        expect(isSkippableObject(obj, { exclude: ['foo'] })).to.equal(true)
      })
    })
  })

  describe('#isUnpopulatedObject', function () {
    context('when object is unpopulated', function () {
      it('should return true', function () {
        expect(isUnpopulatedObject({ type: 'foo', id: 'bar' })).to.equal(true)
      })
    })

    context('when object is populated', function () {
      it('should return false', function () {
        expect(
          isUnpopulatedObject({ type: 'foo', id: 'bar', key: 'value' })
        ).to.equal(false)
      })
    })

    context('when object is missing id', function () {
      it('should return false', function () {
        expect(isUnpopulatedObject({ type: 'foo', key: 'value' })).to.equal(
          false
        )
      })
    })

    context('when object is missing type', function () {
      it('should return false', function () {
        expect(isUnpopulatedObject({ id: 'bar', key: 'value' })).to.equal(false)
      })
    })
  })
})
