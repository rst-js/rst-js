if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/parser.production.min.js")
} else {
  module.exports = require("./cjs/parser.development.js")
}
