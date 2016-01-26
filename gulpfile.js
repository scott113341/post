var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulpif = require('gulp-if');

var babelify = require('babelify');
var browserify = require('browserify');
var injectify = require('csjs-injectify');

var http = require('http');
var nodeStatic = require('node-static');


gulp.task('start-dev', ['watch'], startServer);
gulp.task('build', ['build-js']);

gulp.task('build-js', buildJs);
gulp.task('watch', ['build'], watch);


function buildJs(done) {
  log('building...');

  var isProd = process.env.BUILD_PROD === 'true';

  var bundler = browserify('./src/index.js', { debug: true })
    .transform(babelify)
    .transform(injectify)
    .transform('brfs');

  bundler
    .bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(isProd, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'))
    .on('end', function() {
      log('\x07done\n');
      done();
    });

  function log(out) {
    process.stdout.write(out);
  }
}


function watch() {
  gulp.watch('./src/**/*.js', ['build-js']);
}


function startServer() {
  var server = new nodeStatic.Server('./', { cache: false });
  http.createServer(function(request, response) {
    request.addListener('end', function() {
      server.serve(request, response);
    }).resume();
  }).listen(3000, '0.0.0.0');
}
