var gulp = require('gulp'),
    babel = require('gulp-babel'),
    nodemon = require('gulp-nodemon'),
    del = require('del');

var DIST = 'dist';

gulp.task('clean', function() {
  del(DIST + '/*');
});

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('default', ['clean', 'babel'], function() {
  nodemon({
    script: DIST + '/app.js',
    ext: 'js',
    ignore: [DIST + '/*'],
    tasks: ['clean', 'babel'],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('restart', function () {
    console.log('Retarted server...');
  });
});
