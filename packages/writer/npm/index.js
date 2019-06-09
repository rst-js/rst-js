if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/writer.production.min.js")
} else {
  module.exports = require("./cjs/writer.development.js")
}
