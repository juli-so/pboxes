var gulp = require('gulp');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

gulp.task('build-js', function () {
  return gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-css', function () {
  return gulp.src('src/**/*.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build-js', 'build-css']);
