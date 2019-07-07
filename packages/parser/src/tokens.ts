import { defaultTo } from "ramda"

const defaultList = defaultTo([])

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

export const fieldList = children => ({
  type: "fieldList",
  children
})

export const field = (name, children) => ({
  type: "field",
  name,
  children
})

export const directive = (
  name,
  args = null,
  options = null,
  children = null
) => ({
  type: "directive",
  name,
  args: defaultList(args),
  options: defaultList(options),
  children: defaultList(children)
})
