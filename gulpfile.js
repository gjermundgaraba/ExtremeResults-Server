var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    env = require('gulp-env'),
    mocha = require('gulp-mocha'),
    supertest = require('supertest'),
    exit = require('gulp-exit');


gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 3000
        },
        ignore: ['./node_modules/**', 'spec/**']
    }).on('restart', function () {
        console.log('Restarting...');
    });
});

gulp.task('it', function () {
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
        .pipe(exit());
});