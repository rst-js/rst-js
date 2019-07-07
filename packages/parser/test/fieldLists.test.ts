import { testRunner, trim } from "./utils"
import { field, fieldList, text } from "../src/tokens"

describe("@rst-js/parser", () => {
  describe("field lists", () => {
    testRunner([
      {
        name: "inline field list",
        input: `:key: value`,
        expected: [fieldList([field("key", [text("value")])])],
        only: true
      }
    ])
  })
})
