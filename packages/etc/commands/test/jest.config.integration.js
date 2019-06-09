import { getPackages } from "../shared/packages"
const jestConfig = require("./jest.config")

const packages = getPackages()

const DEV_PACKAGES = ["jest-mocks"]

// Create a module map to point React packages to the build output
const moduleNameMapper = {}
packages
  .filter(([name]) => !DEV_PACKAGES.includes(name))
  .forEach(([directory, pkg]) => {
    // Root entry point
    moduleNameMapper[
      `^@rst-js/${pkg.name}$`
    ] = `<rootDir>/build/packages/${directory}`
    // Named entry points
    moduleNameMapper[
      `^@rst-js/${pkg.name}/(.*)$`
    ] = `<rootDir>/build/packages/${directory}/$1`
  })

module.exports = Object.assign({}, jestConfig, {
  roots: ["<rootDir>/packages/"],
  testPathIgnorePatterns: ["/node_modules/"],
  // Redirect imports to the compiled bundles
  moduleNameMapper,

  // Exclude the build output from transforms
  transformIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],

  collectCoverage: false
})
