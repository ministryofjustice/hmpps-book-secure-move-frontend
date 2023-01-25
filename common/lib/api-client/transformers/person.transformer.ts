import { Person } from '../../../types/person'

export function personTransformer(person: Person) {
  person._image_url = `/person/${person.id}/image`
  person._fullname = [person.last_name, person.first_names]
    .filter(Boolean)
    .join(', ')
    .toUpperCase()
}
