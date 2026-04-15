'use strict';

var gulp = require('gulp');

/** 
 * Compile TypeScript to JS
 */
gulp.task('compile', function (done) {
    var webpack = require('webpack');
    var webpackStream = require('webpack-stream');
    gulp.src(['./src/app/app.ts']).pipe(webpackStream({
        config: require('./webpack.config.js')
    }, webpack))
        .pipe(gulp.dest('./dist'))
        .on('end', function () {
            done();
        });
});