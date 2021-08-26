'use strict';

const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const { series, src, dest } = require('gulp')

const CSS_DIR = './src/css'
const CSS_FILES = CSS_DIR + '/*.css'
const SCSS_FILES = './src/scss/**/*.scss'
const HTML_FILES = './src/*.html'

function scssPrep() {
    src(SCSS_FILES)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(CSS_DIR))
}

function browserSyncTask(cb) {
    browserSync.watch(HTML_FILES).on('change', browserSync.reload)    
    browserSync.watch(CSS_FILES).on('change', browserSync.reload)
    browserSync.watch(SCSS_FILES).on('change', scssPrep)
    browserSync.init({
        server: './src'
    })
    cb()
}

function scssTask(cb) {
    scssPrep()
    cb()
}

exports.scss = scssTask
exports.default = series(scssTask, browserSyncTask)