'use strict'

const rollup = require('rollup')
const del = require('del')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename = require("gulp-rename")
const { series, src, dest, parallel } = require('gulp')
const { terser } = require('rollup-plugin-terser')
const inject = require('gulp-inject')
const path = require('path')
const imagemin = require('gulp-imagemin')
const hash = require('gulp-hash-filename');

//----------------------------------------------------------------
const SRC_DIR = './src'
const DIST_DIR = './dist'
const SRC_JS_BUNDLE_FILES = './src/js/bundle/**/*.js'
const SRC_HTML_DIR = SRC_DIR + '/html'
const DIST_CSS_FILES = DIST_DIR + '/css/**/*.css'

const SRC_CSS_DIR = './src/css'
const SRC_JS_DIR = './src/js'
const SRC_JS_BUNDLE_DIR = SRC_JS_DIR + '/bundle'
const SRC_IMG_FILES = './src/img/**/*.{jpg,png,svg,gif}'
const SRC_CSS_FILES = SRC_CSS_DIR + '/*.css'
const SRC_SCSS_FILES = './src/scss/**/*.scss'
const SRC_HTML_FILES = './src/*.html'
const SRC_JS_FILES = './src/js/**/*.js'
const SRC_FONTS_FILES = './src/fonts/**/*'

const DIST_CSS_DIR = './dist/css'
const DIST_JS_DIR = './dist/js'
const DIST_IMG_DIR = './dist/img'
const DIST_JS_FILES = './dist/js/**/*.js'
const DIST_FONTS_DIR = './dist/fonts'

const ROLLUP_JS_FORMAT = 'es'
const IS_DEV_MODE = process.env.NODE_ENV === 'development'

//----------------------------------------------------------------
function browserSyncTask(cb) {
    browserSync.init({server: './src'})
    browserSync.watch([
        SRC_JS_FILES,
        '!' + SRC_JS_DIR + '/*.bundle.js'
    ]).on('change', () => {buildJSTask(cb); browserSync.reload()})
    browserSync.watch(SRC_HTML_FILES).on('change', browserSync.reload)    
    browserSync.watch(SRC_SCSS_FILES).on('change', () => scssTask(cb))
    cb()
}

function scssTask(cb) {
    src(SRC_SCSS_FILES)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserList: ['last 5 versions'],
            cascade: true
        }))
        .pipe(dest(SRC_CSS_DIR))
        .pipe(browserSync.stream())        
    cb()
}

//----------------------------------------------------------------
async function buildJSTask(cb) {
    const destDir = IS_DEV_MODE ? SRC_JS_BUNDLE_DIR : DIST_JS_DIR
    const entryFileNames = IS_DEV_MODE ? '[name].bundle.js' : '[name].bundle[hash].min.js'

    const options = {
        input: [SRC_JS_DIR + '/main.js']
    }
    if (!IS_DEV_MODE)
        options.plugins = [terser()]

    await rollup.rollup(options)
    .then(bundle => {
        return bundle.write({
            dir: destDir,
            entryFileNames: entryFileNames,
            format: ROLLUP_JS_FORMAT,
            sourcemap: !IS_DEV_MODE
        })
    })      
    cb()
}

function buildCSSTask(cb) {
    src(SRC_CSS_FILES)
        .pipe(cleanCSS())
        .pipe(rename({extname: ".min.css"}))
        .pipe(hash())
        .pipe(dest(DIST_CSS_DIR))
    cb()
}

function buildImagesTask(cb) {
    src(SRC_IMG_FILES)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(DIST_IMG_DIR))
    cb()
}


//--------------------------------------------------
function buildHTMLTask(cb) {
    const template = src(SRC_HTML_DIR + '/index.html')
    const sources = src([
            IS_DEV_MODE ? SRC_JS_BUNDLE_FILES : DIST_JS_FILES,
            IS_DEV_MODE ? SRC_CSS_FILES : DIST_CSS_FILES
        ],
        {
            read: false
        }
    )
    const destDir = IS_DEV_MODE ? SRC_DIR : DIST_DIR
    template.pipe(inject(sources, {
        removeTags: true,
        addRootSlash : false,
        transform: (filePath) => { 
            const newPath = filePath.slice(filePath.indexOf('/') + 1)            
            return path.extname(filePath) === '.css' ? 
                `<link rel="stylesheet" href="${newPath}">` 
                : 
                `<script src="${newPath}"></script>`
        }
    }))
        .pipe(dest(destDir))
    cb()
}

function buildFontsTask(cb) {
    src(SRC_FONTS_FILES)
        .pipe(dest(DIST_FONTS_DIR))
    cb()
}

//--------------------------------------------------
function cleanTask(cb) {    
    del(DIST_DIR)
    del(SRC_JS_BUNDLE_DIR)
    del(SRC_DIR + '/index.html')
    cb()
}

//----------------------------------------------------------------
exports.clean = cleanTask
exports.buildDev = series(parallel(scssTask, buildJSTask), buildHTMLTask), 
exports.default = parallel(
    series(
        parallel(scssTask, buildJSTask), 
        buildHTMLTask
    ), 
    browserSyncTask
)
exports.build = parallel(
    buildImagesTask, buildFontsTask,
    series(parallel(buildCSSTask, buildJSTask), buildHTMLTask)    
)