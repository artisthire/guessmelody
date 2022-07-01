// const del = require('del');
// const {task, src, dest, start, watch} = require('gulp');
// const sass = require('gulp-sass');
// const plumber = require('gulp-plumber');
// const postcss = require('gulp-postcss');
// const autoprefixer = require('autoprefixer');
// const server = require('browser-sync').create();
// const mqpacker = require('css-mqpacker');
// const minify = require('gulp-csso');
// const rename = require('gulp-rename');
// const imagemin = require('gulp-imagemin');
// const rollup = require('gulp-better-rollup');
// const {terser} = require('rollup-plugin-terser');
// const sourcemaps = require('gulp-sourcemaps');
// // const mocha = 'gulp-mocha';
// const commonjs = require('rollup-plugin-commonjs');


import del from 'del';
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import mqpacker from 'css-mqpacker';
import minify from 'gulp-csso';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import imageminOptipng from 'imagemin-optipng';
import imageminJpegtran from 'imagemin-jpegtran';
import rollup from 'gulp-better-rollup';
import {terser} from 'rollup-plugin-terser';
import sourcemaps from 'gulp-sourcemaps';
// import mocha = 'gulp-mocha';
import commonjs from 'rollup-plugin-commonjs';

const server = browserSync.create();

gulp.task(`style`, () =>
  gulp.src(`sass/style.scss`)
    .pipe(plumber())
    .pipe(gulpSass(dartSass)())
    .pipe(
        postcss([
          autoprefixer({
            overrideBrowserslist: [
              `last 1 version`,
              `last 2 Chrome versions`,
              `last 2 Firefox versions`,
              `last 2 Opera versions`,
              `last 2 Edge versions`,
            ],
          }),
          mqpacker({sort: true}),
        ])
    )
    .pipe(gulp.dest(`build/css`))
    .pipe(server.stream())
    .pipe(minify())
    .pipe(rename(`style.min.css`))
    .pipe(gulp.dest(`build/css`))
);

gulp.task(`scripts`, () =>
  gulp.src(`js/main.js`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({plugins: [terser()]}, 'iife'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest(`build/js/`))
);

gulp.task(`copy-html`, () =>
  gulp.src(`*.{html,ico}`).pipe(gulp.dest(`build`))
.pipe(server.stream())
);

gulp.task('copy', gulp.series(`copy-html`, `scripts`, `style`, () =>
  gulp.src([`fonts/**/*.{woff,woff2}`, `img/*.*`], {base: `.`}).pipe(gulp.dest(`build`))
));

gulp.task(`imagemin`, gulp.series(`copy`, () =>
  gulp.src(`build/img/**/*.{jpg,png,gif}`)
    .pipe(
        imagemin([
          imageminOptipng({optimizationLevel: 3}),
          imageminJpegtran({progressive: true}),
        ])
    )
    .pipe(gulp.dest(`build/img`))
));

gulp.task(`clean`, (done) => {
  del.sync(`build`);
  done();
});

gulp.task(`js-watch`, gulp.series(`scripts`, (done) => {
  server.reload();
  done();
}));

gulp.task(`serve`, () => {
  gulp.series(`assemble`);

  server.init({
    server: `./build`,
    notify: false,
    open: false,
    port: 8080,
    ui: false,
  });

  gulp.watch(`sass/**/*.{scss,sass}`, gulp.series(`style`));
  gulp.watch(`*.html`).on(`change`, (e) => {
    if (e.type !== `deleted`) {
      gulp.series(`copy-html`);
    }
  });
  gulp.watch([`js/**/*.js`, `!js/**/*.test.js`], gulp.series(`js-watch`));
});

gulp.task(`assemble`, gulp.series(`clean`, `copy`, `style`));

gulp.task(`build`, gulp.series(`assemble`, `imagemin`));

gulp.task(`test:once`, () =>
  gulp.src(`js/**/*.test.js`)
    .pipe(
        rollup(
            {
              plugins: [commonjs()],
            },
            `cjs`
        )
    )
    .pipe(gulp.dest(`build/test`))
    .pipe(
        mocha({
          reporter: `spec`,
        })
    )
);

gulp.task(`test`, (done) => {
  gulp.series(`test:once`);

  gulp.watch(`js/**/*.js`, gulp.series(`test:once`));
  done();
});
