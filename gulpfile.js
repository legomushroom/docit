var gulp          = require('gulp');
var minifycss     = require('gulp-minify-css');
var stylus        = require('gulp-stylus');
var autoprefixer  = require('gulp-autoprefixer');
var notify        = require('gulp-notify');
var livereload    = require('gulp-livereload');
var coffee        = require('gulp-coffee');
var changed       = require('gulp-changed');
var jade          = require('gulp-jade');
var watch         = require('gulp-jade');
var coffeelint    = require('gulp-coffeelint');
var plumber       = require('gulp-plumber');
var karma         = require('gulp-karma');
var concat        = require('gulp-concat');
var csslint       = require('gulp-csslint');

gulp.task('stylus:main', function(){
  return gulp.src('css/main.styl')
          .pipe(plumber())
          .pipe(stylus())
          .pipe(autoprefixer('last 4 version'))
          .pipe(gulp.dest('css/'))
          .pipe(livereload())
});

gulp.task('stylus:pages', function(){
  return gulp.src('css/pages/*.styl')
          .pipe(plumber())
          .pipe(stylus())
          .pipe(autoprefixer('last 4 version'))
          .pipe(gulp.dest('css/pages/'))
          .pipe(livereload())
});

gulp.task('stylus:kit', function(){
  return gulp.src('css/assets/kit.styl')
          .pipe(plumber())
          .pipe(stylus())
          .pipe(autoprefixer('last 4 version'))
          .pipe(gulp.dest('css/assets/'))
          .pipe(livereload())
});

gulp.task('coffee', function(){
  return gulp.src('js/**/*.coffee')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(changed('js/', { extension: '.js'} ))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'))
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('js/'))
    .pipe(livereload())
});

gulp.task('index:jade', function(e){
  return gulp.src('index.jade')
          .pipe(plumber())
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(''))
          .pipe(livereload())
});

gulp.task('page-templates:jade', function(e){
  return gulp.src('page-templates/**/*.jade')
          .pipe(plumber())
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest('page-templates/'))
          .pipe(livereload())
});

gulp.task('default', function(){
  var server = livereload();
  gulp.watch(['css/main.styl', 'css/general/*.styl'], ['stylus:main']);
  gulp.watch('css/pages/*.styl',        ['stylus:pages']);
  gulp.watch('css/assets/kit.styl',     ['stylus:kit']);
  gulp.watch('index.jade',              ['index:jade']);
  gulp.watch('page-templates/**/*.jade',['page-templates:jade']);
  gulp.watch('js/**/*.coffee',          ['coffee']);
});








