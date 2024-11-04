const express = require('express');
const debug = require('debug')('app:server');
const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config');
const config = require('../config');

const app = express();
const paths = config.utils_paths;

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler));

app.use(express.static(paths.dist()));

module.exports = app;
