var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var uglifyify = require('uglifyify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var babelify = require('babelify');
var browserify = require('browserify');
var injectify = require('csjs-injectify');

var http = require('http');
var nodeStatic = require('node-static');


gulp.task('start-dev', ['_watch-dev'], startServer);
gulp.task('build-dev', ['_build-js-dev', '_build-static']);
gulp.task('build-prod', ['_build-js-prod', '_build-static']);

gulp.task('_build-js-dev', buildJsDev);
gulp.task('_build-js-prod', buildJsProd);
gulp.task('_build-static', buildStatic);
gulp.task('_watch-dev', ['build-dev'], watchDev);


function buildJsDev(done) {
  log('building...');

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


function buildJsProd(done) {
  process.env.NODE_ENV = 'production';

  var bundler = browserify('./src/index.js')
    .transform(babelify)
    .transform(injectify)
    .transform('brfs')
    .transform({ global: true }, 'uglifyify');

  bundler
    .bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build'))
    .on('end', function() {
      done();
    });
}


function buildStatic() {
  gulp.src([
    './CNAME',
    './src/index.html'
  ]).pipe(gulp.dest('./build'));

  gulp.src([
    './src/static/**/*'
  ]).pipe(gulp.dest('./build/static'));
}


function watchDev() {
  gulp.watch('./src/**/*.js', ['_build-js-dev']);
}


function startServer() {
  var server = new nodeStatic.Server('./build', { cache: false });
  http.createServer(function(request, response) {
    request.addListener('end', function() {
      server.serve(request, response);
    }).resume();
  }).listen(3000, '0.0.0.0');
}
