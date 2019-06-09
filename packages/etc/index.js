const program = require("commander")

program
  .command("test")
  .description(
    "Run jest test runner. Passes through all flags directly to Jest"
  )
  .action(require("./commands/test"))

program
  .command("build [packages...]")
  .description("Build all packages")
  .action(require("./commands/build"))

program
  .command("release")
  .option("--dev", "Publish pre-release")
  .description("Publish packages")
  .action(require("./commands/release"))

program.parse(process.argv)
