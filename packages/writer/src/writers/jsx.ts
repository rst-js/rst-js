import * as t from "@babel/types"
import generate from "@babel/generator"

export default function(parsed: any, { layout = null, components = {} } = {}) {
  const documentState = new DocumentState({
    components: getComponents(components)
  })
  const document = writeElement(parsed, documentState)

  const imports = getImports(documentState)
  let wrappedDocument = document

  if (layout) {
    const layoutName = "Layout"
    imports.push(
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(layoutName))],
        t.stringLiteral(layout)
      )
    )
    wrappedDocument = t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier(layoutName), []),
      t.jsxClosingElement(t.jsxIdentifier(layoutName)),
      [document],
      false
    )
  }

  const body = t.exportDefaultDeclaration(
    t.functionDeclaration(
      null,
      [],
      t.blockStatement([t.returnStatement(wrappedDocument as t.Expression)])
    )
  )

  const program = t.program([...imports, body])

  return generate(program).code
}

type ImportType = "named" | "default"

class DocumentState {
  imports: { [module: string]: { [name: string]: ImportType } }
  components: ComponentImports

  constructor({ components }) {
    this.imports = {}
    this.components = components
  }

  addImport(module, name, type: ImportType = "named") {
    if (this.imports[module] == null) {
      this.imports[module] = {}
    }

    this.imports[module][name] = type
  }

  addElement(type) {
    const component = this.components[type]

    if (component == null) {
      throw new Error(`Unknown component ${type}`)
    }

    let module,
      name,
      importType: ImportType = "named"
    if (Array.isArray(component)) {
      ;[module, name] = component
    } else {
      module = component
      name = componentName(type)
      importType = "default"
    }
    this.addImport(module, name, importType)
    return name
  }
}

export function writeElement(
  { type, children, ...props }: any,
  documentState: DocumentState
) {
  if (type === "text") {
    return t.jsxText(props.value)
  }

  const name = t.jsxIdentifier(documentState.addElement(type))
  const attributes = []

  Object.keys(props).forEach(key => {
    const value = props[key]

    let astValue
    if (Array.isArray(value)) {
      astValue = t.jsxExpressionContainer(t.arrayExpression(value))
    } else if (typeof value === "string") {
      astValue = t.stringLiteral(value)
    } else {
      astValue = t.jsxExpressionContainer(t.numericLiteral(value))
    }

    attributes.push(t.jsxAttribute(t.jsxIdentifier(key), astValue))
  })

  const elementChildren = children.map((tokenProps: any) =>
    writeElement(tokenProps, documentState)
  )
  const hasChildren = elementChildren.length
  const selfClosing = !hasChildren

  return t.jsxElement(
    t.jsxOpeningElement(name, attributes, selfClosing),
    hasChildren ? t.jsxClosingElement(name) : null,
    elementChildren,
    selfClosing
  )
}

function getImports(documentState: DocumentState) {
  const imports = []

  imports.push(
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier("React"))],
      t.stringLiteral("react")
    )
  )

  for (const module in documentState.imports) {
    const specifiers = []

    Object.keys(documentState.imports[module]).forEach(name => {
      const importType = documentState.imports[module][name]
      if (importType === "default") {
        specifiers.push(t.importDefaultSpecifier(t.identifier(name)))
      } else {
        specifiers.push(
          t.importSpecifier(t.identifier(name), t.identifier(name))
        )
      }
    })

    imports.push(t.importDeclaration(specifiers, t.stringLiteral(module)))
  }

  return imports
}

const defaultModule = "@rst-js/react"

const componentTypes = [
  "document",
  "section",
  "title",
  "paragraph",
  "strongEmphasis",
  "emphasis",
  "interpretedText",
  "inlineLiteral",
  "externalReference",
  "substitutionReference",
  "footnoteReference",
  // "citationReference",

  "bullet_list",
  "enumerated_list",
  "list_item",
  "definition_list",
  "definition_list_item",
  "definition",
  "term",

  "literal_block",
  "block_quote",
  "transition",

  "directive"
] as const

type ComponentImports = {
  [type: string]: [string, string] | string
}

function getComponents(
  source: ComponentImports | string = defaultModule
): ComponentImports {
  const components = {}
  componentTypes.forEach(type => {
    if (typeof source === "string") {
      // Import all components from single module
      components[type] = [source, componentName(type)]
    } else {
      // Override imports for specific compoennts
      const customComponent = source[type]
      components[type] =
        customComponent != null
          ? customComponent
          : [defaultModule, componentName(type)]
    }
  })
  return components
}

const componentName = value =>
  value.replace(/(^|_)(\w)/g, (match, p1, p2) => p2.toUpperCase())
