const { getPluginOptions } = require("./utils/plugin-options")

/**
 * Add the webpack config for loading reST files
 */
exports.onCreateWebpackConfig = require("./gatsby/create-webpack-config")

/**
 * Add the reST extensions as resolvable. This is how the page creator
 * determines which files in the pages/ directory get built as pages.
 */
exports.resolvableExtensions = (data, pluginOptions) =>
  getPluginOptions(pluginOptions)

/**
 * Convert reST to JSX so that Gatsby can extract the GraphQL queries.
 */
exports.preprocessSource = require("./gatsby/preprocess-source")
