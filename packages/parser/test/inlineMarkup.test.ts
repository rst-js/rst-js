import { testRunner } from "./utils"
import {
  emphasis,
  externalReference,
  footnoteReference,
  inlineLiteral,
  internalReference,
  interpretedText,
  paragraph,
  strongEmphasis,
  substitutionReference,
  text
} from "../src/tokens"

describe("@rst-js/parser", () => {
  describe("inline markup", () => {
    testRunner([
      {
        name: "emphasis",
        input: `*emphasis*`,
        expected: [paragraph([emphasis("emphasis")])]
      },
      {
        name: "strong emphasis",
        input: `**strong emphasis**`,
        expected: [paragraph([strongEmphasis("strong emphasis")])]
      },
      {
        name: "interpreted text",
        input: "`interpreted text`",
        expected: [paragraph([interpretedText("interpreted text")])]
      },
      {
        name: "inlineLiteral",
        input: "``inline literal``",
        expected: [paragraph([inlineLiteral("inline literal")])]
      },
      {
        name: "substitution reference",
        input: "|substitution reference|",
        expected: [paragraph([substitutionReference("substitution reference")])]
      },
      {
        name: "internal reference",
        input: "_`internal reference`",
        expected: [paragraph([internalReference("internal reference")])]
      },
      {
        name: "external reference",
        input: "`external reference`_",
        expected: [paragraph([externalReference("external reference")])]
      },
      {
        name: "footnote reference",
        input: "[footnote reference]_",
        expected: [paragraph([footnoteReference("footnote reference")])]
      },
      {
        name: "multiple inline markups",
        input: `Regular *emphasis* **strong**`,
        expected: [
          paragraph([
            text("Regular "),
            emphasis("emphasis"),
            text(" "),
            strongEmphasis("strong")
          ])
        ]
      },
      {
        name: "escaped inline markup",
        input: `\\*emphasis\\*`,
        expected: [paragraph([text("*emphasis*")])]
      }
    ])
  })
})
