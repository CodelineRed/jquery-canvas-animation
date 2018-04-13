var browserSync = require('browser-sync').create();
var gulp        = require('gulp');
var minifyCss   = require('gulp-clean-css');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');

var sourcePath = "src/";
var distPath = "dist/";
var localServer = 'http://localhost/imhh-jquery-canvas-animation/example/';

// processing scss to css and minify result
gulp.task('scss', function() {
    return gulp.src(sourcePath + 'scss/jquery.canvas-animation.scss')
        .pipe(sass())
        .pipe(gulp.dest(distPath + 'css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(distPath + 'css/'));
});

// concatinate and uglify all js
gulp.task('js', function() {
    return gulp.src(sourcePath + 'js/jquery.canvas-animation.js')
        .pipe(gulp.dest(distPath + 'js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(distPath + 'js/'));
});

// add the watcher
gulp.task('watch', function() {
    // watch scss files
    gulp.watch(sourcePath + 'scss/**', ['scss']);
    // watch js files
    gulp.watch(sourcePath + 'js/**', ['js']);
});

// production
gulp.task('prod', ['scss', 'js']);

// default task if just called gulp (incl. Watch)
gulp.task('default', ['scss', 'js', 'watch'], function() {
    // start browsersync
    browserSync.init({
        proxy: localServer
    });

    gulp.watch(distPath + '**/*.{css,js}').on('change', browserSync.reload);
});