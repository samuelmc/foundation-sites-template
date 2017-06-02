var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minifyCss = require('gulp-mini-css');
var uglify = require('uglify-js-harmony');
var minifyJs = require('gulp-uglify/minifier');
var rename = require('gulp-rename');

var sassPaths = [
    'bower_components/normalize.scss/sass',
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src',
    'bower_components/foundation-datepicker-plugin/src/scss/plugin',
    'bower_components/foundation-perfect-scrollbar/src/scss/plugin',
    'bower_components/foundation-select/src/scss/plugin',
    'bower_components/font-awesome/scss'
];

var jsVendorPaths = [
    'bower_components/jquery/dist/jquery?(.min).js',
    'bower_components/spin.js/spin?(.min).js',
    'bower_components/spin.js/jquery.spin.js',
    'bower_components/what-input/dist/what-input?(.min).js',
    'bower_components/mustache.js/mustache?(.min).js',
    'bower_components/moment/min/moment-with-locales?(.min).js',
    'bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery?(.min).js',
    'bower_components/foundation-sites/dist/js/foundation?(.min).js',
    'bower_components/foundation-datepicker-plugin/dist/js/foundation.datepicker?(.min).js',
    'bower_components/foundation-perfect-scrollbar/dist/js/foundation.perfectScrollbar?(.min).js',
    'bower_components/foundation-select/dist/js/foundation.select?(.min).js',
];

gulp.task('sass', function () {
    return gulp.src('scss/app.scss')
        .pipe($.sass({
            includePaths: sassPaths,
            outputStyle: 'expanded' // if css compressed **file size**
        })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest('../public/css'));
});

gulp.task('vendor', function () {
    return gulp.src(jsVendorPaths)
        .pipe(gulp.dest('../public/js/vendor'));
});

gulp.task('minify-css', function () {
    return gulp.src(['../public/css/**/*.css', '!../public/css/vendor/**/*.css', '!../public/css/**/*.min.css'])
        .pipe(minifyCss({ext: '.min.css'}))
        .pipe(gulp.dest('../public/css'));
});

gulp.task('minify-js', function () {
    return gulp.src(['../public/js/**/*.js', '!../public/js/vendor/**/*.js', '!../public/js/**/*.min.js'])
        .pipe(minifyJs({}, uglify))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../public/js'));
});

gulp.task('babel', function () {
    return gulp.src(['js/**/!(app)*.js', 'js/app.js'])
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('../public/js'));
});

gulp.task('default', ['vendor', 'sass', 'babel'], function () {
    gulp.watch(['scss/**/*.scss', 'scss/**/*.sass'], ['sass']);
    gulp.watch(['js/**/*.js'], ['babel']);
    gulp.watch(['../public/js/**/*.js', '!../public/js/vendor/**/*.js', '!../public/js/**/*.min.js'], ['minify-js']);
    gulp.watch(['../public/css/**/*.css', '!../public/css/vendor/**/*.css', '!../public/css/**/*.min.css'], ['minify-css']);
    gulp.watch(jsVendorPaths, ['vendor']);
});


