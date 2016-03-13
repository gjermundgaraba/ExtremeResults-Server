var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    env = require('gulp-env'),
    mocha = require('gulp-mocha'),
    supertest = require('supertest'),
    istanbul = require('gulp-istanbul');
    exit = require('gulp-exit');


gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 4321
        },
        ignore: ['./node_modules/**', 'spec/**']
    }).on('restart', function () {
        console.log('Restarting...');
    });
});

gulp.task('pre-test', function () {
    return gulp.src(['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'app.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire())
        // Write the covered files to a temporary directory
        .pipe(gulp.dest('test-tmp/'));
});

gulp.task('it', ['pre-test'], function () {
    env({
       vars: {
           ENV: 'test',
           PORT: 3333
       }
    });
    gulp.src('tests/it/*.js', {read: false})
        .pipe(mocha({
            reporter: 'nyan'
        }))
        .pipe(istanbul.writeReports())
        .pipe(exit());
});