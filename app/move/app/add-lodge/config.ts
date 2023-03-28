export function config(id: string) {
  return {
    journeyName: `add-lodge-${id}`,
    name: `add-lodge-${id}`,
    template: '../../../../form-wizard',
    templatePath: 'move/app/add-lodge/views/',
  }
}
