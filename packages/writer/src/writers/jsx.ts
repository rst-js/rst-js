import * as t from "@babel/types"
import generate from "@babel/generator"

export default function(parsed: any) {
  const documentState = new DocumentState()
  const document = writeElement(parsed, documentState) as t.Expression

  const imports = getImports(documentState)

  const body = t.exportDefaultDeclaration(
    t.functionDeclaration(
      null,
      [],
      t.blockStatement([t.returnStatement(document)])
    )
  )

  const program = t.program([...imports, body])

  return generate(program).code
}

type ComponentImports = {
  [type: string]: [string, string]
}

const defaultComponents: ComponentImports = {
  document: ["@rst-js/react", "Document"],
  section: ["@rst-js/react", "Section"],
  title: ["@rst-js/react", "Title"],
  paragraph: ["@rst-js/react", "Paragraph"]
}

class DocumentState {
  imports: { [module: string]: { [name: string]: boolean } }
  components: ComponentImports

  constructor() {
    this.imports = {}
    this.components = defaultComponents
  }

  addImport(module, name) {
    if (this.imports[module] == null) {
      this.imports[module] = {}
    }

    this.imports[module][name] = true
  }

  addElement(type) {
    const [module, name] = this.components[type]
    this.addImport(module, name)
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
    attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier(key),
        typeof value === "string"
          ? t.stringLiteral(value)
          : t.jsxExpressionContainer(t.numericLiteral(value))
      )
    )
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
      specifiers.push(name)
    })

    imports.push(
      t.importDeclaration(
        specifiers.map(name =>
          t.importSpecifier(t.identifier(name), t.identifier(name))
        ),
        t.stringLiteral(module)
      )
    )
  }

  return imports
}
