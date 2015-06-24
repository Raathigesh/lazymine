/*global require, console, process, __dirname*/
var browserSync = require('browser-sync').create(),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    karma = require('karma').server,
    minifyCss = require('gulp-minify-css'),
    NwBuilder = require('node-webkit-builder'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify');

var bases = {
    src: 'src/',
    dist: 'dist/',
    concat: 'dist/concat/',
    webkit: 'dist/build/',
    win64_build: 'dist/build/Lazymine/win64',
    win32_build: 'dist/build/Lazymine/win32'
};

var paths = {
    main: ['src/js/main.js'], // since we need to browserify this file specifically
    scripts: ['js/shell/*.js', 'js/support/*.js'],
    libs: ['js/lib/*.*', 'css/lib/*.*', 'css/fonts/*.*', 'css/lib/fonts/*.*'],
    styles: ['css/*.*'],
    html: ['index.html'],
    images: ['assets/*.*'],
    extras: ['package.json'],
    chrome_extension: ['extension/manifest.json', 'extension/background.js'],
    custom_configuration: ['configuration.json']
};

var filesToMove = paths.libs.concat(paths.html)
                    .concat(paths.images)
                    .concat(paths.extras)
                    .concat(paths.chrome_extension);

gulp.task('clean', function () {
    "use strict";
    return gulp.src(bases.dist)
        .pipe(rimraf());
});

gulp.task('browserify', function () {
    "use strict";
    return gulp.src(paths.main, {cwd: bases.src})
        .pipe(browserify({
            transform: 'reactify',
            debug : false
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('build-scripts', function () {
    "use strict";
    return gulp.src(paths.scripts, {cwd: bases.src})
        .pipe(concat('support.js'))
        .pipe(uglify())
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('build-css', function () {
    "use strict";
    return gulp.src(paths.styles, {cwd: bases.src})
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(bases.concat + 'css/'));
});

gulp.task('dev-browserify', function () {
    "use strict";
    return gulp.src(paths.main, {cwd: bases.src})
        .pipe(browserify({
            transform: 'reactify',
            debug : false
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('dev-build-scripts', function () {
    "use strict";
    return gulp.src(paths.scripts, {cwd: bases.src})
        .pipe(concat('support.js'))
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('dev-build-css', function () {
    "use strict";
    return gulp.src(paths.styles, {cwd: bases.src})
        .pipe(concat('style.css'))
        .pipe(gulp.dest(bases.concat + 'css/'));
});

gulp.task('copy-extras', function () {
    "use strict";
    return gulp.src(filesToMove, { base: bases.src, cwd: bases.src })
        .pipe(gulp.dest(bases.concat));
});

gulp.task('copy-custom-config', function () {
    "use strict";
    return gulp.src(paths.custom_configuration, { base: bases.src, cwd: bases.src })
        .pipe(gulp.dest(bases.win32_build))
        .pipe(gulp.dest(bases.win64_build));
});

gulp.task('webkit-build', function () {
    "use strict";
    var nw = new NwBuilder({
        version: '0.12.0',
        files: [ bases.dist + '**'],
        platforms: ['win'],
        buildDir: bases.webkit,
        winIco: 'lazymine.ico'
    });

    nw.on('log', function (msg) {
        gutil.log('node-webkit-builder', msg);
    });

    return nw.build().catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });
});

gulp.task('test', function (done) {
    "use strict";
    return karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (code) {
        if (code !== 0) {
            gutil.log(gutil.colors.red('ONE OR MORE TEST CASES HAVE FAILED! BUILD STOPPED!'));
            process.exit(code);
        } else {
            done();
        }
    });
});

gulp.task('default', function (callback) {
    "use strict";
    runSequence(['clean'],
                ['dev-build-scripts', 'dev-build-css', 'copy-extras'],
                ['browserify-With-Watch'],
                ['watch'],
                callback);
});

gulp.task('ci', function (callback) {
    "use strict";
    runSequence('clean',
        ['browserify-Without-Watch', 'build-scripts', 'build-css', 'copy-extras'],
        'webkit-build',
        'copy-custom-config',
        callback);
});

gulp.task('build', function (callback) {
    "use strict";
    runSequence(['clean', 'test'],
                ['browserify', 'build-scripts', 'build-css', 'copy-extras'],
                'webkit-build',
                'copy-custom-config',
                callback);
});

// ===========================================================
// TRIAL AND ERROR AREA 


gulp.task('watch', function () {
    "use strict";
    gulp.watch('src/css/*.*', [ 'dev-build-css' ]);
});


gulp.task('browserify-With-Watch', function () {
    "use strict";
    var bundler = browserify({
            entries: [paths.main], // Only need initial file, browserify finds the deps
            transform: [reactify], // We want to convert JSX to normal javascript
            debug: false, // Gives us sourcemapping
            cache: {},
            packageCache: {},
            fullPaths: true // Requirement of watchify
        }),
        watcher  = watchify(bundler);

    return watcher.on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
            .pipe(source('main.js'))
            .pipe(gulp.dest(bases.concat + 'js/')); // This is where you add uglifying etc.
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    }).bundle() // Create the initial bundle when starting the task
        .pipe(source('main.js'))
        .pipe(gulp.dest(bases.concat + 'js/'));
});

gulp.task('browserify-Without-Watch', function () {
    "use strict";
    var bundler = browserify({
        entries: [paths.main], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: false, // Gives us sourcemapping
        cache: {},
        packageCache: {},
        fullPaths: true // Requirement of watchify
    });

    return bundler.bundle() // Create the initial bundle when starting the task
        .pipe(source('main.js'))
        .pipe(gulp.dest(bases.concat + 'js/'));
});

// ===========================================================
