const Bundles = require("./bundles")
const Packaging = require("./packaging")
// const Stats = require("./stats")
const { asyncRimRaf } = require("./utils")

const rollup = require("./rollup")
const babel = require("./babel")
const noop = require("./noop")

const { UNIVERSAL, NODE, NOOP } = Bundles.bundleTypes

const builders = {
  [UNIVERSAL]: rollup,
  [NODE]: babel,
  [NOOP]: noop
}

function shouldSkipBundle(requestedPackages, bundle, bundleType) {
  if (requestedPackages.length > 0) {
    const isAskingForDifferentEntries = requestedPackages.every(
      requestedName => bundle.entry.indexOf(requestedName) === -1
    )
    if (isAskingForDifferentEntries) {
      return true
    }
  }
  return false
}

module.exports = async function build(requestedPackages) {
  await asyncRimRaf("build")

  // Run them serially for better console output
  // and to avoid any potential race conditions.
  for (const bundle of Bundles.bundles) {
    if (shouldSkipBundle(requestedPackages, bundle, bundle.type)) continue

    const builder = builders[bundle.type]
    if (!builder) {
      console.log("Unknown type")
      continue
    }

    await builder(bundle)
  }

  // console.log(Stats.printResults())
  // if (argv.saveStats) Stats.saveResults()

  await Packaging.prepareNpmPackages()
}
