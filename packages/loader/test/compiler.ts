import path from "path"
import webpack from "webpack"
import MemoryFS from "memory-fs"

export default (fixture: string): Promise<any> => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.rst$/,
          use: [
            // {
            //   loader: "babel-loader",
            //   options: {
            //     // presets: ["@babel/preset-env", "@babel/preset-react"]
            //     plugins: ["@babel/plugin-syntax-jsx"]
            //   }
            // },
            "raw-loader",
            path.resolve(__dirname, "../src/loader.ts")
          ]
        }
      ]
    }
  })

  compiler.outputFileSystem = new MemoryFS()

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors.join("\n")))

      resolve(stats)
    })
  })
}
