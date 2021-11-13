var gulp        = require('gulp');
var minifyCss   = require('gulp-clean-css');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass')(require('sass'));
var less        = require('gulp-less');
var uglify      = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var sourcePath  = "src/";
var distPath    = "dist/";
var localServer = 'http://localhost/imhh-jca/example/';

// processing scss to css and minify result
gulp.task('scss', function() {
    return gulp.src(sourcePath + 'scss/jquery.canvas-animation.scss')
        .pipe(sass())
        .pipe(gulp.dest(distPath + 'css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(distPath + 'css/'));
});

// processing scss to css and minify result
gulp.task('less', function() {
    return gulp.src(sourcePath + 'less/jquery.canvas-animation.less')
        .pipe(less())
        .pipe(gulp.dest(distPath + 'css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(distPath + 'css/'));
});

// create minified and non minified files
gulp.task('js', function() {
    return gulp.src([
            sourcePath + 'js/jquery.canvas-animation-editor.js',
            sourcePath + 'js/jquery.canvas-animation.js'
        ])
        .pipe(gulp.dest(distPath + 'js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(distPath + 'js/'));
});

// concatinate and uglify all js files
gulp.task('js-bundle', function() {
    return gulp.src([
            sourcePath + 'js/jquery.canvas-animation-editor.js',
            sourcePath + 'js/jquery.canvas-animation.js'
        ])
        .pipe(concat('jquery.canvas-animation.bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distPath + 'js/'));
});

// add the watcher
gulp.task('watch', function() {
    // watch scss files
    gulp.watch(sourcePath + 'scss/**', ['scss']);
    // watch js files
    gulp.watch(sourcePath + 'js/**', ['js', 'js-bundle']);
});

// build
gulp.task('build', gulp.series('scss', 'js', 'js-bundle'));

// default task if just called gulp (incl. Watch)
gulp.task('default', gulp.series('scss', 'js', 'js-bundle', 'watch'), function() {
    // start browsersync
    browserSync.init({
        proxy: localServer
    });

    gulp.watch(distPath + '**/*.{css,js}').on('change', browserSync.reload);
});