import fs from 'fs'
import path from 'path'
import { load } from 'js-yaml'

// Import config paths with TypeScript support
import configPaths from '../../config/paths'

/**
 * Return a macro name for a component
 * @param {string} componentName
 * @returns {string} returns naming convention based macro name
 */
function componentNameToMacroName(componentName: string): string {
  const macroName = componentName
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `app${macroName}`
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples(componentName: string): Record<string, any> {
  const docs = getConfig(componentName)

  const examples: Record<string, any> = {}

  for (const example of docs.examples) {
    examples[example.name] = example.data
  }

  return examples
}

/**
 * Return YAML configuration file for a component as an object
 * @param {string} componentName
 * @returns {object} returns object that contains the component configuration
 */
function getConfig(componentName: string): any {
  const componentPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)

  // Ensure components path is valid
  if (!fs.existsSync(configPaths.components)) {
    throw new Error(`Components directory not found: ${configPaths.components}`)
  }

  // Ensure the YAML file exists for the component
  if (!fs.existsSync(componentPath)) {
    throw new Error(`YAML file for component not found: ${componentPath}`)
  }

  const file = fs.readFileSync(componentPath, 'utf8')

  return load(file)
}

/**
 * Map component folders to metadata, macro names, and URLs
 * @param {string} mountpath
 * @returns {(component: { name: string }) => { name: string; url: string; config: any; macroName: string }}
 */
function mapComponentFolder(
  mountpath = ''
): (component: { name: string }) => { name: string; url: string; config: any; macroName: string } {
  return ({ name }) => {
    const componentPath = path.join(configPaths.components, name)

    // Ensure the component folder exists
    if (!fs.existsSync(componentPath)) {
      throw new Error(`Component folder not found: ${componentPath}`)
    }

    return {
      name,
      url: `${mountpath}/${name}`,
      config: getConfig(name),
      macroName: componentNameToMacroName(name),
    }
  }
}

export {
  componentNameToMacroName,
  getExamples,
  getConfig,
  mapComponentFolder,
}
