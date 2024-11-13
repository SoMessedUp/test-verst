import { src, dest, watch, parallel, series} from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import newer from 'gulp-newer';
import svgSprite from 'gulp-svg-sprite';
import pug from 'gulp-pug';
import clean from 'gulp-clean';
import squoosh from 'gulp-squoosh';
import avifWebpHTML from 'gulp-avif-webp-html';

const scss = gulpSass(dartSass);

function html() {
    return src('src/pug/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(avifWebpHTML())
        .pipe(dest('src/'))
}

function images() {
    return src([
        'src/img/src/*.*',
        '!src/img/src/*.svg'
    ], { encoding: false })
    .pipe(newer('src/img/compressed'))
    .pipe(squoosh({
        webp: { quality: 85 },
        avif: { quality: 50 },
        mozjpeg: { quality: 75 },
        png: { quality: [60, 80], speed: 4 }
    }))
    .pipe(dest('src/img/compressed'))
}

function sprite() {
    return src('src/img/src/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite:'../sprite.svg',
                example: true
            }
        }
    }))
    .pipe(dest('src/img/compressed'))
}


function scripts() {
    return src([
        'src/js/*.js',
        '!src/js/main.min.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify.default())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('src/scss/style.scss')
    .pipe(autoprefixer({
        overrideBrowserslist: ['> 1%', 'last 10 versions', 'Firefox ESR', 'not dead']
    }))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream())
}

function watching() {
    watch(['src/scss/style.scss'], styles)
    watch(['src/img/src'], images)
    watch(['src/img/src/*.svg'], sprite)
    watch(['src/js/main.js'], scripts)
    watch(['src/pug/**/*.pug'], html)
    watch(['src/*.html']).on('change', browserSync.reload)
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

function cleanBuild() {
    return src('build')
    .pipe(clean())
}

function building() {
    return src([
        'src/css/style.min.css',
        'src/img/compressed/**/*',
        'src/js/main.min.js',
        'src/**/*.html',
        'src/fonts/*'
    ], {base : 'src'})
    .pipe(dest('build'))
}

export {styles, scripts, watching, browsersync, images, sprite, html};
export const build = series(cleanBuild, building);
export default parallel(styles, images, scripts, html, browsersync, watching, sprite);