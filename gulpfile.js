var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify', function(){
    gulp.src('src/js/main.js')
    .pipe(browserify({transform:'reactify'}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function(){
    gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
	
	gulp.src('src/manifest.json')
    .pipe(gulp.dest('dist'));
	
	gulp.src('src/js/background.js')
    .pipe(gulp.dest('dist/js'));

    gulp.src('src/css/style.css')
    .pipe(gulp.dest('dist/css'));
	
	gulp.src('src/assets/icon_016.png')
    .pipe(gulp.dest('dist/assets'));
	
	gulp.src('src/assets/icon_128.png')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('default', ['browserify', 'copy']);

gulp.task('watch', function(){
    gulp.watch('src/**/*.*', ['default']);
});

gulp.task('ci', ['browserify', 'copy']);

