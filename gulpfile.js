var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var nodeInspector = require('gulp-node-inspector');

gulp.task('browser-sync',['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:8000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 8001,
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
  return gulp.src('app/public/styles/scss/main.scss')
    .pipe(sass({
      // outputStyle: 'compressed'
      }).on('error', sass.logError))
    .pipe(gulp.dest('app/public/styles/css'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('app/public/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});



gulp.task('nodemon', function () {
  nodemon({
    script: 'app/app.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  // , exec: 'node-inspector & node --debug'
  })
});

gulp.task('serve', ['browser-sync'], function(){
  gulp.watch("app/public/styles/scss/**/*.scss", ['styles']);
  gulp.watch("app/public/scripts/**/*.js", ['scripts']);
  gulp.watch("app/views/**/*.jade", ['bs-reload']);
  // gulp.watch(config.jade.watch, ['jade', browserSync.reload]);
});
