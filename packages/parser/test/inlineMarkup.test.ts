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
        expected: [paragraph([emphasis([text("emphasis")])])]
      },
      {
        name: "strong emphasis",
        input: `**strong emphasis**`,
        expected: [paragraph([strongEmphasis([text("strong emphasis")])])]
      },
      {
        name: "interpreted text",
        input: "`interpreted text`",
        expected: [paragraph([interpretedText([text("interpreted text")])])]
      },
      {
        name: "inlineLiteral",
        input: "``inline literal``",
        expected: [paragraph([inlineLiteral([text("inline literal")])])]
      },
      {
        name: "substitution reference",
        input: "|substitution reference|",
        expected: [
          paragraph([substitutionReference([text("substitution reference")])])
        ]
      },
      {
        name: "internal reference",
        input: "_`internal reference`",
        expected: [paragraph([internalReference([text("internal reference")])])]
      },
      {
        name: "external reference",
        input: "`external reference`_",
        expected: [paragraph([externalReference([text("external reference")])])]
      },
      {
        name: "footnote reference",
        input: "[footnote reference]_",
        expected: [paragraph([footnoteReference([text("footnote reference")])])]
      },
      {
        name: "multiple inline markups",
        input: `Regular *emphasis* **strong**`,
        expected: [
          paragraph([
            text("Regular "),
            emphasis([text("emphasis")]),
            text(" "),
            strongEmphasis([text("strong")])
          ])
        ]
      },
      {
        name: "escaped inline markup",
        input: `\\*emphasis\\*`,
        expected: [paragraph([text("*emphasis*")])]
      },
      {
        name: "show help message for incomplete markup",
        input: `*test`,
        error: "Emphasis isn't terminated."
      }
    ])
  })
})
