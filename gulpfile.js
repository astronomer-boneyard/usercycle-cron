var gulp = require('gulp'),
    babel = require('gulp-babel'),
    nodemon = require('gulp-nodemon'),
    del = require('del');

var settings = {
  dist: 'dist'
};

gulp.task('clean', function() {
  del(settings.dist + '/*');
});

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest(settings.dist));
});

gulp.task('watch', ['clean', 'babel'], function() {
  nodemon({
    script: settings.dist + '/app.js',
    ext: 'js',
    ignore: [settings.dist + '/*'],
    tasks: ['clean', 'babel'],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('restart', function () {
    console.log('Retarted server...');
  });
});

gulp.task('build', ['clean', 'babel']);
