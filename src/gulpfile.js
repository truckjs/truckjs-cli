var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
 
 
gulp.task('build', function () {
  // app.js is your app's JavaScript:
  return browserify({entries: 'dev/app.js', debug: true})
    // Use Babel to convert ES6 to ES5:
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('map'))
    .pipe(gulp.dest('dist'));
});
 
var src = {
  js: 'dev/app.js',
  html: './index.html'
};

// Static Server + watching css/html files:
gulp.task('serve', ['build'], function() {

  browserSync({
    server: "./",
    port: 4040
    // ,browser: ['chrome']
  });

  // Added any other files you want to watch:
  gulp.watch(src.js, ['default']);
  gulp.watch('data/*.json', ['default']);
  gulp.watch(src.html).on('change', reload);
});
 
gulp.task('default', ['build', 'serve'], reload);