import { getOptions } from "loader-utils"
import { transform } from "@rst-js/writer"

export default function loader(source) {
  const options = getOptions(this)

  return transform(source, "jsx", options)
}
