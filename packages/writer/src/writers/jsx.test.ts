import fs from "fs-extra"
import path from "path"
import { format } from "prettier"
import { transform } from "@rst-js/writer"

const prettier = (source: string) => format(source, { parser: "babel" })

const FIXTURES_DIR = "fixtures"

describe("@rst-js/writers - jsx", () => {
  const cases = [
    {
      name: "Transform reST to JSX",
      fileName: "document.rst"
    },
    {
      name: "Empty document",
      fileName: "empty.rst"
    },
    {
      name: "With custom layout",
      fileName: "with-layout.rst"
    }
  ]

  cases.forEach(testCase => {
    it(testCase.name, () => {
      const optionsPath = path.resolve(
        __dirname,
        path.join(
          FIXTURES_DIR,
          testCase.fileName.replace(/\.rst$/, ".options.json")
        )
      )
      const options = fs.existsSync(optionsPath)
        ? fs.readJSONSync(optionsPath)
        : undefined

      const input = fs
        .readFileSync(
          path.resolve(__dirname, path.join(FIXTURES_DIR, testCase.fileName))
        )
        .toString()

      const actual = transform(input, "jsx", options)

      const expected = fs
        .readFileSync(
          path.resolve(
            __dirname,
            path.join(
              FIXTURES_DIR,
              testCase.fileName.replace(/\.rst$/, ".expected.js")
            )
          )
        )
        .toString()

      expect(prettier(actual)).toEqual(prettier(expected))
    })
  })
})
