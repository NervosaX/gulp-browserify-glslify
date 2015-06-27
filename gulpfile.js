var rimraf = require("rimraf");
var browserSync = require("browser-sync");
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
// var glslify = require('glslify');

gulp.task('js', function() {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/index.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: ["glslify"]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(glslify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(cb) {
  rimraf('dist/', cb);
});

gulp.task('html', function() {
  gulp.src("src/**/*.html")
    .pipe(gulp.dest("dist"));
});

gulp.task('sync-reload', ['js'], function() {
  browserSync.reload();
});

gulp.task('watch', function() {
  browserSync.init({
    // Don't open browser on start
    open: false,
    server: {
      baseDir: "dist"
    }
  });

  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.js', ['sync-reload']);
  gulp.watch('dist/**/*', ['sync-reload']);
});

gulp.task('default', ['clean', 'js', 'html', 'watch']);
