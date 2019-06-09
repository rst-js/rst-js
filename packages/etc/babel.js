module.exports = function() {
  const isTest = process.env.BABEL_ENV === "test"

  const targets = {
    node: 8,
    browsers: "> 1%, last 2 versions"
  }

  const modules = isTest ? "commonjs" : false

  const presets = [
    [
      "@babel/preset-env",
      {
        targets,
        modules
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ]

  const plugins = [
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-transform-runtime"
  ]

  return {
    presets,
    plugins
  }
}
