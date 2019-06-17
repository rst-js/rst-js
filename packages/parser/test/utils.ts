import { parse } from "@rst-js/parser"
import * as tokens from "../src/tokens"

export function testRunner(testCases) {
  testCases.forEach(testCase => {
    ;(testCase.only ? test.only : test)(testCase.name, () => {
      if (testCase.error) {
        expect(() => parse(testCase.input)).toThrowError(testCase.error)
      } else {
        // console.log(testCase.input.replace(/ /g, "␣").replace(/\n/g, "⏎"))
        // console.log(JSON.stringify(parse(testCase.input), null, 2))
        expect(parse(testCase.input)).toEqual(
          tokens.document(testCase.expected)
        )
      }
    })
  })
}

export function trim(strings, ...values) {
  // Interweave the strings with the
  // substitution vars first.
  let output = ""
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i]
  }
  output += strings[values.length]

  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/)

  // Rip out the leading whitespace.
  return lines
    .map(line => line.replace(/^\s+/gm, ""))
    .join("\n")
    .trim()
}