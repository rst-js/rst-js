import { testRunner, trim } from "./utils"
import { text, directive, field, paragraph } from "../src/tokens"

describe("@rst-js/parser", () => {
  describe("directives", () => {
    testRunner([
      {
        name: "just directive without arguments, options or content",
        input: `.. directive::`,
        expected: [directive("directive")]
      },
      {
        name: "directive with argument",
        input: `.. directive:: argument`,
        expected: [directive("directive", [text("argument")])]
      },
      {
        name: "directive with options",
        input: trim`
          .. directive::
             :answer: 42
             :key: value
        `,
        expected: [
          directive(
            "directive",
            [],
            [field("answer", [text("42")]), field("key", [text("value")])]
          )
        ]
      },
      {
        name: "directive with content",
        input: trim`
          .. directive::

             First paragraph
             
             Second paragraph`,
        expected: [
          directive(
            "directive",
            [],
            [],
            [
              paragraph([text("First paragraph")]),
              paragraph([text("Second paragraph")])
            ]
          )
        ]
      },
      {
        name:
          "blankline isn't required between directive without arguments or options and content",
        input: trim`
          .. directive::
             Paragraph
        `,
        expected: [
          directive("directive", null, null, [paragraph([text("Paragraph")])])
        ]
      },
      {
        name: "directive with options and content",
        input: trim`
          .. directive::
             :answer: 42
             :key: value

             Paragraph
        `,
        expected: [
          directive(
            "directive",
            [],
            [field("answer", [text("42")]), field("key", [text("value")])],
            [paragraph([text("Paragraph")])]
          )
        ]
      },
      {
        name: "directive above content",
        input: trim`
          .. directive::
          
          Paragraph`,
        expected: [directive("directive"), paragraph([text("Paragraph")])]
      },
      {
        only: true,
        name: "directives can be nested",
        input: trim`
          .. first::
          
             First directive's paragraph
             
             .. second::
             
                Second directive's paragraph
                
             First directive's paragraph
             
          Top-level paragraph
          `,
        expected: [
          directive(
            "first",
            [],
            [],
            [
              paragraph([text("First directive's paragraph")]),
              directive(
                "second",
                [],
                [],
                [paragraph([text("Second directive's paragraph")])]
              ),
              paragraph([text("First directive's paragraph")])
            ]
          ),
          paragraph([text("Top-level paragraph")])
        ]
      }
    ])
  })
})
