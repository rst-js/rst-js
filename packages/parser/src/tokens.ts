export const document = children => ({
  type: "document",
  children
})

// Inline elements

export const text = value => ({
  type: "text",
  value
})

export const emphasis = value => ({
  type: "emphasis",
  value
})

export const strongEmphasis = value => ({
  type: "strongEmphasis",
  value
})

export const interpretedText = value => ({
  type: "interpretedText",
  value
})

export const inlineLiteral = value => ({
  type: "inlineLiteral",
  value
})

export const substitutionReference = value => ({
  type: "substitutionReference",
  value
})

export const internalReference = value => ({
  type: "internalReference",
  value
})

export const externalReference = value => ({
  type: "externalReference",
  value
})

export const footnoteReference = value => ({
  type: "footnoteReference",
  value
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
