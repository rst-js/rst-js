import * as t from "@babel/types"
import generate from "@babel/generator"

type ComponentImports = {
  [type: string]: [string, string]
}

const defaultComponents: ComponentImports = {
  document: ["@rst-js/react", "Document"],
  section: ["@rst-js/react", "Section"],
  title: ["@rst-js/react", "Title"],
  paragraph: ["@rst-js/react", "Paragraph"],
  strong: ["@rst-js/react", "Strong"],
  emphasis: ["@rst-js/react", "Emphasis"],
  // interpreted_text: ["@rst-js/react", "InterpretedText"],
  literal: ["@rst-js/react", "Literal"],
  reference: ["@rst-js/react", "Reference"],
  substitution_reference: ["@rst-js/react", "SubstitutionReference"],
  footnote_reference: ["@rst-js/react", "FootnoteReference"],
  citation_reference: ["@rst-js/react", "CitationReference"],

  bullet_list: ["@rst-js/react", "BulletList"],
  enumerated_list: ["@rst-js/react", "EnumeratedList"],
  list_item: ["@rst-js/react", "ListItem"],
  definition_list: ["@rst-js/react", "DefinitionList"],
  definition_list_item: ["@rst-js/react", "DefinitionListItem"],
  definition: ["@rst-js/react", "Definition"],
  term: ["@rst-js/react", "Term"],

  literal_block: ["@rst-js/react", "LiteralBlock"],
  block_quote: ["@rst-js/react", "BlockQuote"],
  transition: ["@rst-js/react", "Transition"]
}

export default function(parsed: any, { layout = null, components = {} } = {}) {
  const allComponents = {
    ...defaultComponents,
    ...components
  }
  const documentState = new DocumentState({ components: allComponents })
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
      console.error(type)
      throw new Error(`Unknown component ${type}`)
    }

    let module,
      name,
      importType: ImportType = "named"
    if (Array.isArray(component)) {
      ;[module, name] = component
    } else {
      module = component
      name = type.replace(/(^\w)|(_\w)/, match => match.toUpperCase())
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
