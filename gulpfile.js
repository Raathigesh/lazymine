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

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');

var bases = {
 src: 'src/',
 dist: 'dist/',
 concat: 'dist/concat/',
 webkit: 'dist/build/'
};

var paths = {
	main: ['src/js/main.js'], // since we need to browserify this file specifically
	scripts: ['js/shell/*.js'],
	libs: ['js/lib/*.*', 'css/lib/*.*', 'css/fonts/*.*', 'css/lib/fonts/*.*'],
	styles: ['css/*.*'],
	html: ['index.html'],
	images: ['assets/*.*'],
	extras: ['package.json'],
    chrome_extension: ['extension/manifest.json', 'extension/background.js']
};

var filesToMove = paths.libs.concat(paths.html)										
					.concat(paths.images)
					.concat(paths.extras)
                    .concat(paths.chrome_extension);
					
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
				['dev-build-scripts', 'dev-build-css', 'copy-extras'],
                ['browserify-With-Watch'],
                ['watch'],
				callback);		
});

gulp.task('ci', function(callback) {
    runSequence('clean',
        ['browserify-With-Watch', 'build-scripts', 'build-css', 'copy-extras'],
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
    gulp.watch('src/css/*.*', ['dev-build-css']);
});


gulp.task('browserify-With-Watch', function() {
    var bundler = browserify({
        entries: [paths.main], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    return watcher
        .on('update', function () { // When any files update
            var updateStart = Date.now();
            console.log('Updating!');
            watcher.bundle() // Create new bundle that uses the cache for high performance
                .pipe(source('main.js'))
                // This is where you add uglifying etc.
                .pipe(gulp.dest(bases.concat + 'js/'));
            console.log('Updated!', (Date.now() - updateStart) + 'ms');
        })
        .bundle() // Create the initial bundle when starting the task
        .pipe(source('main.js'))
        .pipe(gulp.dest(bases.concat + 'js/'));
});
// ===========================================================
