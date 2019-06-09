const escapeStringRegexp = require("escape-string-regexp")
const { getPluginOptions } = require("../utils/plugin-options")

module.exports = ({ loaders, actions }, pluginOptions) => {
  const options = getPluginOptions(pluginOptions)

  const testPattern = new RegExp(
    options.extensions.map(ext => `${escapeStringRegexp(ext)}$`).join("|")
  )
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: testPattern,
          use: [
            loaders.js(),
            {
              loader: "@rst-js/loader"
            }
          ]
        }
      ]
    }
  })
}
