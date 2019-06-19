export const document = children => ({
  type: "document",
  children
})

// Inline elements

export const text = value => ({
  type: "text",
  value
})

export const emphasis = children => ({
  type: "emphasis",
  children
})

export const strongEmphasis = children => ({
  type: "strongEmphasis",
  children
})

export const interpretedText = children => ({
  type: "interpretedText",
  children
})

export const inlineLiteral = children => ({
  type: "inlineLiteral",
  children
})

export const substitutionReference = children => ({
  type: "substitutionReference",
  children
})

export const internalReference = children => ({
  type: "internalReference",
  children
})

export const externalReference = children => ({
  type: "externalReference",
  children
})

export const footnoteReference = children => ({
  type: "footnoteReference",
  children
})

// Block Elements

export const paragraph = children => ({
  type: "paragraph",
  children
})

export const section = (depth, children) => ({
  type: "section",
  depth,
  children
})

export const title = children => ({
  type: "title",
  children
})
