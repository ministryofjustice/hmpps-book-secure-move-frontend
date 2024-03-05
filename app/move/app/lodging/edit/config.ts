export function config(id: string) {
  return {
    journeyName: `lodging-edit-${id}`,
    name: `lodging-edit-${id}`,
    template: '../../../../../form-wizard',
    templatePath: 'move/app/lodging/edit/views/',
  }
}
