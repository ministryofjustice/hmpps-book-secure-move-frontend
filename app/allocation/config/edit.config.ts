import * as path from 'path'

const config = (id: string) => {
  return {
    name: `edit-allocation-${id}`,
    templatePath: path.join(__dirname, '..', 'views'),
    template: 'allocation-details',
    journeyName: `cancel-allocation-${id}`,
    journeyPageTitle: 'actions::change_allocation',
  }
}

export default config
