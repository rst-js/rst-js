module.exports = {
  packagesDir: "./packages",
  buildDir: "./build",

  bundles: [
    {
      type: "universal",
      path: "react"
    },
    {
      type: "universal",
      path: "writer"
    },
    {
      type: "universal",
      path: "parser"
    },
    {
      type: "node",
      path: "loader"
    },
    {
      type: "noop",
      path: "gatsby-plugin-rst"
    }
  ]
}
