const express = require("express");
const webpack = require("webpack");
const WebpackDevMiddleware = require("webpack-dev-middleware");

const port = process.env.PORT || 3000;
const webpackConfig = require("../build/webpack.config");
const compiler = webpack(webpackConfig);

const app = express();
app.use(WebpackDevMiddleware(compiler));
app.use(express.static("./dist"));

app.listen(port);
console.log(`Server is now running at http://localhost:${port}.`);
