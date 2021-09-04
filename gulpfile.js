'use strict'

//===================================================================

const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const rename = require("gulp-rename")
const babel = require('gulp-babel')
const rollup = require('gulp-rollup')
const { series, src, dest } = require('gulp')

//===================================================================

const SRC_CSS_DIR = './src/css'
const SRC_JS_DIR = './src/js'
const SRC_CSS_FILES = SRC_CSS_DIR + '/*.css'
const SRC_SCSS_FILES = './src/scss/**/*.scss'
const SRC_HTML_FILES = './src/*.html'
const SRC_JS_FILES = './src/js/**/*.js'

const DEST_CSS_DIR = './dest/css'
const DEST_JS_DIR = './dest/js'
const DEST_JS_FILES = './dest/js/**/*.js'

//===================================================================

function scssPrep() {
    src(SRC_SCSS_FILES)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(SRC_CSS_DIR))
}

function bundleJSTask(cb) {
    src(SRC_JS_FILES)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(rollup({        
        input: [SRC_JS_DIR + '/main.js', SRC_JS_DIR + '/swiper-config.js'],
        output: {
            format: 'esm'
        }
    }))
    .pipe(dest(DEST_JS_DIR))
    cb()
}

function browserSyncTask(cb) {
    browserSync.watch(SRC_JS_FILES).on('change', browserSync.reload)
    browserSync.watch(SRC_HTML_FILES).on('change', browserSync.reload)
    browserSync.watch(SRC_CSS_FILES).on('change', browserSync.reload)
    browserSync.watch(SRC_SCSS_FILES).on('change', scssPrep)
    browserSync.init({
        server: './src',
        ignore: './node_modules'
    })
    cb()
}

function scssTask(cb) {
    scssPrep()
    cb()
}

function minifyCSSTask(cb) {
    src(SRC_CSS_FILES)
        .pipe(cleanCSS())
        .pipe(rename({extname: ".min.css"}))
        .pipe(dest(DEST_CSS_DIR))
    cb()
}

function compressImagesTask(cb) {
    cb()
}

function buildJSTask(cb) {    
    src(SRC_JS_FILES)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(rollup({        
        input: [SRC_JS_DIR + '/main.js', SRC_JS_DIR + '/swiper-config.js'],
        output: {
            format: 'esm'
        }
    }))    
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(dest(DEST_JS_DIR))    
    cb()
}

//===================================================================

exports.bundleJS = bundleJSTask
exports.scss = scssTask
exports.compressImages = compressImagesTask
exports.minifyCSS = minifyCSSTask
exports.default = series(bundleJSTask, scssTask, browserSyncTask)
exports.build = series(buildJSTask, minifyCSSTask, compressImagesTask)