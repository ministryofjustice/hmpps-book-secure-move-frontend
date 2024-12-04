import { find } from 'lodash';
import { Request, Response, NextFunction } from 'express';

interface Component {
  name: string
  [key: string]: unknown
}

interface ComponentRequest extends Request {
  component?: Component
  activeComponent?: string
  components?: Component[]
}

function setComponent(components: Component[]) {
  return (req: ComponentRequest, res: Response, next: NextFunction, componentName: string): void => {
    const component = find(components, { name: componentName })

    if (component) {
      req.component = component
      req.activeComponent = component.name
    }

    next()
  }
}

function setComponents(components: Component[] = []) {
  return (req: ComponentRequest, res: Response, next: NextFunction): void => {
    req.components = components
    next()
  }
}

export {
  setComponent,
  setComponents,
}
