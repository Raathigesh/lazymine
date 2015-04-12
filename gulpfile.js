var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var NwBuilder = require('node-webkit-builder');
var gutil = require('gulp-util');

gulp.task('browserify', function () {
    gulp.src('src/js/main.js')
        .pipe(browserify({
            transform: 'reactify',
            debug : true
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('webkit-build', function () {

    var nw = new NwBuilder({
        version: '0.12.0',
        files: ['./dist/**'],
        platforms: ['win']
    });

    nw.on('log', function (msg) {
        gutil.log('node-webkit-builder', msg);
    });

    return nw.build().catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });
});

gulp.task('copy', function () {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));

    gulp.src('src/js/shell/*.*')
        .pipe(gulp.dest('dist/js/shell'));

    gulp.src('src/package.json')
        .pipe(gulp.dest('dist'));

    gulp.src('src/css/*.*')
        .pipe(gulp.dest('dist/css'));

    gulp.src('src/js/lib/*.*')
        .pipe(gulp.dest('dist/js/lib'));

    gulp.src('src/assets/*.*')
        .pipe(gulp.dest('dist/assets'));

    gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['browserify', 'copy']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['default']);
});

gulp.task('ci', ['browserify', 'copy']);

gulp.task('build', ['browserify', 'copy', 'webkit-build']);
