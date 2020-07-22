const isAllowedDependent = require('./is-allowed-dependent')

describe('Helpers', function () {
  describe('Field helpers', function () {
    describe('#isAllowedDependent', function () {
      let fields, values, result

      beforeEach(function () {
        fields = {
          'field-1': {},
          'field-2': {},
          'field-3': {
            dependent: 'field-2',
          },
        }
        values = {
          'field-1': 'abc',
          'field-2': 'def',
          'field-3': 'hij',
        }
      })

      it('returns false if field does not exist', function () {
        result = isAllowedDependent(fields, 'field-99', values)
        expect(result).to.be.false
      })

      it('returns true if there is no dependent field', function () {
        result = isAllowedDependent(fields, 'field-1', values)
        expect(result).to.be.true
      })

      it('returns true if there is a dependent field that matches the value', function () {
        values['field-2'] = true
        result = isAllowedDependent(fields, 'field-3', values)
        expect(result).to.be.true
      })

      it('returns true if dependent field does not exist', function () {
        fields['field-3'].dependent = {
          field: '__non_existent__',
          value: true,
        }
        result = isAllowedDependent(fields, 'field-3', values)
        expect(result).to.be.true
      })

      it('returns true if there is a dependent field thatdoes not matches the value', function () {
        values['field-2'] = false
        result = isAllowedDependent(fields, 'field-3', values)
        expect(result).to.be.false
      })

      it('returns true if one of the field values matches one of the field values', function () {
        fields['field-3'].dependent = {
          field: 'field-2',
          value: ['c', 'd', 'e'],
        }
        values['field-2'] = ['a', 'b', 'c']
        result = isAllowedDependent(fields, 'field-3', values)
        expect(result).to.be.true
      })

      it('returns false if none of the field values matches any of the field values', function () {
        fields['field-3'].dependent = {
          field: 'field-2',
          value: ['x', 'y', 'z'],
        }
        values['field-2'] = ['a', 'b', 'c']
        result = isAllowedDependent(fields, 'field-3', values)
        expect(result).to.be.false
      })
    })
  })
})
