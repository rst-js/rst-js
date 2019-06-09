import restructured from "restructured"

import * as writers from "./writers"

export function transform(source: string, writer: "jsx") {
  const writerModule = writers[writer]

  const parsed = restructured.parse(source)
  return writerModule(parsed)
}
