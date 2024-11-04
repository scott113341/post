const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = require('../config');

const paths = config.utils_paths;

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
};
