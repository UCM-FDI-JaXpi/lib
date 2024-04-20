const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.jpg$/,
        use: {
          loader: "url-loader"
        } 
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to : 'assets' },
        { from: './src/img', to : 'img' }
      ]
    })
  ],

  // El problema de dependencias con webpack se resuelve con los polyfills
  // Sin embargo, no existen polifills para todas las dependencias
  // (En concreto no existen para worker_threads ni queue-typescript)
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"), // Polyfill para el módulo 'path'
      "queue-typescript": require.resolve("queue-typescript"), // Polyfill para el módulo 'queue-typescript'
      "worker_threads": false, // No hay polyfill estándar para 'worker_threads', por lo que lo configuramos como false
      "node-localstorage": false, // No hay polyfill estándar para 'node-localstorage', por lo que lo configuramos como false
	  "fs": false, // No hay polyfill estándar para 'fs', por lo que lo configuramos como false
      "events": require.resolve("events/"), // Polyfill para el módulo 'events'
      "util": require.resolve("util/") // Polyfill para el módulo 'util'
    }
  }
};