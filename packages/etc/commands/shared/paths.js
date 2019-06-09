const fs = require("fs-extra")
const path = require("path")

const PACKAGES_DIR = "build/packages"

const appDirectory = fs.realpathSync(process.cwd())

const packagesDirectory = path.join(appDirectory, PACKAGES_DIR)

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

function getPackageJson() {
  try {
    return fs.readJSONSync(resolveApp("package.json"))
  } catch (e) {
    return null
  }
}

module.exports = {
  appDirectory,
  packagesDirectory,
  resolveApp,
  getPackageJson
}
