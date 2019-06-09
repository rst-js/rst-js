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
  const Header = `h${depth}`
  return <Header>{children}</Header>
}

export const Paragraph = ({ children }) => <p>{children}</p>
