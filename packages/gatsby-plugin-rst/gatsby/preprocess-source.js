const path = require("path")
const { transform } = require("@rst-js/writer")

const { getPluginOptions } = require("../utils/plugin-options")

module.exports = function preprocessSource(
  { filename, contents },
  pluginOptions
) {
  const { extensions, layout } = getPluginOptions(pluginOptions)
  const ext = path.extname(filename)

  if (!extensions.includes(ext)) return null

  return transform(contents, "jsx", {
    layout
  })
}
