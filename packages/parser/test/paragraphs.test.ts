import { testRunner, trim } from "./utils"
import { paragraph, text } from "../src/tokens"

describe("@rst-js/parser", () => {
  describe("paragraphs", () => {
    testRunner([
      {
        name: "single line",
        input: trim`
          Hello world
        `,
        expected: [paragraph([text("Hello world")])]
      },
      {
        name: "multiple lines",
        input: trim`
          Hello
          world
        `,
        expected: [paragraph([text("Hello world")])]
      },
      {
        name: "multiple paragraphs",
        input: trim`
          Hello
          
          World
          
          
          
          Multiline!
        `,
        expected: [
          paragraph([text("Hello")]),
          paragraph([text("World")]),
          paragraph([text("Multiline!")])
        ]
      },
      {
        name: "unexpected leading whitespace causes an error",
        input: trim`
          Hello
             World with leading whitespace    
        `,
        error: "Unexpected indent"
      }
    ])
  })
})
