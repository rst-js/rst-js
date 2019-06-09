"use strict"

const bundleTypes = {
  UNIVERSAL: "UNIVERSAL",
  NODE: "NODE",
  NOOP: "NOOP"
}

const bundles = [
  {
    type: bundleTypes.UNIVERSAL,
    entry: "@rst-js/react",
    externals: ["react"]
  },

  {
    type: bundleTypes.UNIVERSAL,
    entry: "@rst-js/writer",
    externals: []
  },
  {
    type: bundleTypes.NODE,
    entry: "@rst-js/loader"
  },
  {
    type: bundleTypes.NOOP,
    entry: "gatsby-plugin-rst"
  }
]

// Based on deep-freeze by substack (public domain)
function deepFreeze(o) {
  Object.freeze(o)
  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (
      o[prop] !== null &&
      (typeof o[prop] === "object" || typeof o[prop] === "function") &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop])
    }
  })
  return o
}

// Don't accidentally mutate config as part of the build
deepFreeze(bundles)

module.exports = {
  bundleTypes,
  bundles
}
