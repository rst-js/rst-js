const fs = require("fs-extra")
const path = require("path")
const { packagesDirectory } = require("./paths")

function getPackages() {
  return fs
    .readdirSync(packagesDirectory)
    .map(directory => path.join(packagesDirectory, directory))
    .filter(directory => fs.lstatSync(directory).isDirectory())
    .map(directory => {
      const packagePath = path.join(
        packagesDirectory,
        directory,
        "package.json"
      )
      try {
        return [directory, require(packagePath)]
      } catch (error) {}

      return null
    })
    .filter(Boolean)
}

module.exports = {
  getPackages
}
