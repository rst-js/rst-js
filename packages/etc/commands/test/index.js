const jest = require("jest")
const { getPackageJson } = require("../shared/paths")

const appPackageJson = getPackageJson()

module.exports = () => {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = "test"
  process.env.NODE_ENV = "test"

  const defaultJestConfig = require("./jest.config")

  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on("unhandledRejection", err => {
    throw err
  })

  const args = []

  args.push(
    "--config",
    JSON.stringify({
      ...defaultJestConfig,
      ...appPackageJson.jest
    })
  )

  if (!process.env.CI) {
    args.push("--watch")
  }

  jest.run(args)
}
