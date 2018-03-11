const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/*.pug',
        dest: 'build'
    },
    styles: {
        src: 'src/styles/**/*.sass',
        dest: 'build/styles'
    },
    images: {
        src: 'src/images/*.*',
        dest: 'build/images/'
    },
    icons: {
        src: 'src/images/icons/*.*',
        dest: 'build/images/icons'
    }
}

//watch
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.icons.src, icons);
}

//watch build
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

//clear
function clean() {
    return del(paths.root);
}

// pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}


// sass
function styles() {
    return gulp.src('./src/styles/app.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
}

//img
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

//icons
function icons() {
    return gulp.src(paths.icons.src).pipe(gulp.dest(paths.icons.dest));
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.icons = icons;


gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, images, icons),
    gulp.parallel(watch, server)
));