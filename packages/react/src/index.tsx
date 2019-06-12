import * as React from "react"

const SectionContext = React.createContext(0)

export const Document = ({ children }) => <article>{children}</article>

export const Section = ({ children, depth }) => (
  <section>
    <SectionContext.Provider value={depth}>{children}</SectionContext.Provider>
  </section>
)

export const Title = ({ children }) => {
  const depth = React.useContext(SectionContext)
  return React.createElement(`h${depth}`, {}, children)
}

export const Paragraph = ({ children }) => <p>{children}</p>
export const Strong = ({ children }) => <strong>{children}</strong>
export const Emphasis = ({ children }) => <em>{children}</em>
export const Literal = ({ children }) => <code>{children}</code>
export const Reference = ({ children }) => <a>{children}</a>
export const BulletList = ({ children }) => <ul>{children}</ul>
export const ListItem = ({ children }) => <li>{children}</li>
export const EnumeratedList = ({ children }) => <ol>{children}</ol>
export const DefinitionList = ({ children }) => <dl>{children}</dl>
export const DefinitionListItem = ({ children }) => <>{children}</>
export const Term = ({ children }) => <dt>{children}</dt>
export const Definition = ({ children }) => <dd>{children}</dd>
export const LiteralBlock = ({ children }) => <pre>{children}</pre>
export const BlockQuote = ({ children }) => <blockquote>{children}</blockquote>
export const Transition = () => <hr />
