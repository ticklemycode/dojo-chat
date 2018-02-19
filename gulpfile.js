const gulp = require('gulp');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

const sources = {
  html: {
    in: './app/index.html',
    out: './app/dist'
  },
  css: {
    in: './app/sass/**/*.scss',
    out: './app/dist/css'
  },
  js: {
    watch: './app/js/**/*.js',
    in: './app/js/app.js',
    out: './app/dist/js'
  }
}

// HTML task
gulp.task('html', function () {
  gulp.src(sources.html.in)
  .pipe(gulp.dest(sources.html.out))
  .pipe(connect.reload());
});

// ES6 JS
gulp.task('js', () => {
  return browserify({entries: sources.js.in, debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(sources.js.out))
    .pipe(connect.reload());
});

// SASS task
gulp.task('sass', function () {
  return gulp.src(sources.css.in)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(sources.css.out))
    .pipe(connect.reload());
});
 

// Live reload server
gulp.task('connect', function() {
  connect.server({
      livereload: true
  });
});


// watch task
gulp.task('watch', function () {
  gulp.watch([sources.html.in], ['html']);
  gulp.watch(sources.css.in, ['sass']);
  gulp.watch(sources.js.watch, ['js']);
});


// default task
gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch']);