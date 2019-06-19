import { testRunner, trim } from "./utils"
import { emphasis, paragraph, section, text, title } from "../src/tokens"

describe("@rst-js/parser", () => {
  describe("section", () => {
    testRunner([
      {
        name: "section with overline",
        input: trim`
          ===
          RST
          ===
        `,
        expected: [section(1, [title([text("RST")])])]
      },
      {
        name: "section overline must match underline",
        input: trim`
          ===
          RST
          ---
        `,
        error: "Section overline must match underline"
      },
      {
        name: "section without overline",
        input: trim`
          RST
          ===
        `,
        expected: [section(1, [title([text("RST")])])]
      },
      {
        name: "sibling sections",
        input: trim`
          =====
          First
          =====

          ======
          Second
          ======
        `,
        expected: [
          section(1, [title([text("First")])]),
          section(1, [title([text("Second")])])
        ]
      },
      {
        name: "child sections",
        input: trim`
          =====
          First
          =====

          Second
          ------
        `,
        expected: [
          section(1, [
            title([text("First")]),
            section(2, [title([text("Second")])])
          ])
        ]
      },
      {
        name: "sections hierarchy",
        input: trim`
          Top-level paragraph
          
          =========
          First One
          =========
          
          Paragraph One

          First Two
          ---------
          
          Paragraph Two
          
          =========
          Second One
          =========
          
          Paragraph Three
        `,
        expected: [
          paragraph([text("Top-level paragraph")]),
          section(1, [
            title([text("First One")]),
            paragraph([text("Paragraph One")]),
            section(2, [
              title([text("First Two")]),
              paragraph([text("Paragraph Two")])
            ])
          ]),
          section(1, [
            title([text("Second One")]),
            paragraph([text("Paragraph Three")])
          ])
        ]
      },
      {
        name: "inline markup inside section title",
        input: trim`
          *****
          *RST*
          *****
        `,
        expected: [section(1, [title([emphasis([text("RST")])])])]
      }
    ])
  })
})
