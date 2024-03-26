export function config(id: string) {
  return {
    journeyName: `lodging-new-${id}`,
    name: `lodging-new-${id}`,
    template: '../../../../../form-wizard',
    templatePath: 'move/app/lodging/new/views/',
  }
}
