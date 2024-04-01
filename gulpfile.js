var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var fancy_log = require('fancy-log');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var paths = {
    pages: ['src/*.html','src/*.css', 'src/*.ico']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .on('error', fancy_log)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
}

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch("dist/*.js", function(done) {
        browserSync.reload();
        done();
    });
});

function browsing(){
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch("dist/*.js", function(done) {
        browserSync.reload();
        done();
    });
}

gulp.task('default', gulp.series(gulp.parallel('copy-html'), bundle, browsing));
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', fancy_log);


