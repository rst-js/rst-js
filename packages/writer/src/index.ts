import * as writers from "./writers"
import { parse } from "@rst-js/parser"

export function transform(source: string, writer: "jsx", writerOptions) {
  const writerModule = writers[writer]

  const parsed = parse(source)
  return writerModule(parsed, writerOptions)
}
