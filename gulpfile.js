var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma').server;
var minifyCss = require('gulp-minify-css');
var nwBuilder = require('node-webkit-builder');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');

var bases = {
 src: 'src/',
 dist: 'dist/',
 concat: 'dist/concat/',
 webkit: 'dist/build/'
};

var paths = {
	main: ['js/main.js'], // since we need to browserify this file specifically
	scripts: ['js/shell/*.js'],
	libs: ['js/lib/*.*', 'css/lib/*.*', 'fonts/*.*'],
	styles: ['css/*.*'],
	html: ['index.html'],
	images: ['assets/*.png'],
	extras: ['package.json'],
};

var filesToMove = paths.libs.concat(paths.html)										
					.concat(paths.images)
					.concat(paths.extras);
					
gulp.task('clean', function() {
	return gulp.src(bases.dist)
		.pipe(clean());
});
					
gulp.task('browserify', function () {
    return gulp.src(paths.main, {cwd: bases.src})
        .pipe(browserify({
            transform: 'reactify',
            debug : true
        }))
        .pipe(concat('main.js'))	
		.pipe(uglify())		
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('build-scripts', function() {
	return gulp.src(paths.scripts, {cwd: bases.src})
		.pipe(concat('support.js'))
		.pipe(uglify())
		.pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('build-css', function() {
  return gulp.src(paths.styles, {cwd: bases.src})
	.pipe(concat('style.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(bases.concat + 'css/'));
});

gulp.task('dev-browserify', function () {
    return gulp.src(paths.main, {cwd: bases.src})
        .pipe(browserify({
            transform: 'reactify',
            debug : true
        }))
        .pipe(concat('main.js'))			
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('dev-build-scripts', function() {
	return gulp.src(paths.scripts, {cwd: bases.src})
		.pipe(concat('support.js'))		
		.pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('dev-build-css', function() {
  return gulp.src(paths.styles, {cwd: bases.src})
	.pipe(concat('style.css'))    
    .pipe(gulp.dest(bases.concat + 'css/'));
});

gulp.task('copy-extras', function () {	
	return gulp.src(filesToMove, { base: bases.src, cwd: bases.src })
		.pipe(gulp.dest(bases.concat));
});

gulp.task('webkit-build', function () {
    var nw = new nwBuilder({
        version: '0.12.0',
        files: [ bases.dist + '**'],
        platforms: ['win'],
		buildDir: bases.webkit
    });

    nw.on('log', function (msg) {
        gutil.log('node-webkit-builder', msg);
    });

    return nw.build().catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });
});

gulp.task('test', function (done) {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function(code) {
		if(code != 0) {
			gutil.log(gutil.colors.red('ONE OR MORE TEST CASES HAVE FAILED! BUILD STOPPED!'));
			process.exit(code);
		}
		else {
			done();
		}
    });
});

gulp.task('default', function(callback) {
	runSequence(['clean'],
				['dev-browserify', 'dev-build-scripts', 'dev-build-css', 'copy-extras'],				
				callback);		
});

gulp.task('ci', function(callback) {
    runSequence('clean',
        ['browserify', 'build-scripts', 'build-css', 'copy-extras'],
        'webkit-build',
        callback);
});

gulp.task('build', function(callback) {
	runSequence(['clean', 'test'],
				['browserify', 'build-scripts', 'build-css', 'copy-extras'],
				'webkit-build',
				callback);
});

// ===========================================================
// TRIAL AND ERROR AREA 


gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['default']);
});

gulp.task('serve', ['default'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch('src/**/*.*', ['default', browserSync.reload]);
});

// ===========================================================
