import { getOptions } from "loader-utils"
import { transform } from "@rst-js/writer"

export default function loader(source) {
  const options = getOptions(this)

  try {
    return transform(source, "jsx", options)
  } catch (e) {
    console.error(e)
    return source
  }
}
