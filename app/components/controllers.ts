import { find } from 'lodash'
import { Request, Response } from 'express'

interface Component {
  config?: {
    examples?: Array<{
      name: string
      [key: string]: any
    }>
  }
  [key: string]: any
}

interface CustomRequest extends Request {
  components?: Component[]
  component?: Component
  activeComponent?: Component
}

function renderComponent(req: CustomRequest, res: Response): void {
  res.render('components/views/component', {
    components: req.components,
    component: req.component,
    activeComponent: req.activeComponent,
  })
}

function renderRawExample(req: CustomRequest, res: Response): void {
  const component = req.component
  const example = find(component?.config?.examples, {
    name: req.params.example,
  })

  res.render('components/views/example', {
    example,
    component,
  })
}

function renderList(req: CustomRequest, res: Response): void {
  res.render('components/views/list', {
    components: req.components,
  })
}

export { renderComponent, renderRawExample, renderList }
