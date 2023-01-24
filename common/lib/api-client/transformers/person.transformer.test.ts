import { expect } from 'chai'

import { Person } from '../../../types/person'

import { personTransformer } from './person.transformer'

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#personTransformer', function () {
      let person: Person

      beforeEach(function () {
        person = {
          id: '12345',
          first_names: 'Foo',
          last_name: 'Bar',
        }
        personTransformer(person)
      })

      it('should add custom properties', function () {
        expect(person).to.deep.equal({
          id: '12345',
          first_names: 'Foo',
          last_name: 'Bar',
          _image_url: '/person/12345/image',
          _fullname: 'BAR, FOO',
        })
      })
    })
  })
})
