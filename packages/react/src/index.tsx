import * as React from "react"

const SectionContext = React.createContext(0)

export const useSection = () => React.useContext(SectionContext)

export const Section = ({ children, depth }) => (
  <section>
    <SectionContext.Provider value={depth}>{children}</SectionContext.Provider>
  </section>
)

export const Title = ({ children }) => {
  const depth = useSection()
  return React.createElement(`h${depth}`, {}, children)
}

export const Document = "article"
export const Paragraph = "p"
export const Strong = "strong"
export const Emphasis = "em"
export const Literal = "code"
export const Reference = "a"
export const BulletList = "ul"
export const ListItem = "li"
export const EnumeratedList = "ol"
export const DefinitionList = "dl"
export const DefinitionListItem = React.Fragment
export const Term = "dt"
export const Definition = "dd"
export const LiteralBlock = "pre"
export const BlockQuote = "blockquote"
export const Transition = "hr"
