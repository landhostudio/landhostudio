'use strict';

var gulp          = require('gulp'),
    cache         = require('gulp-cache'),
    runSequence   = require('run-sequence'),
    flatten       = require('gulp-flatten');

var sass          = require('gulp-sass'),
    combineMq     = require('gulp-combine-mq'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssnano       = require('gulp-cssnano'),
    csscomb       = require('gulp-csscomb'),
    bourbon       = require('node-bourbon').includePaths,
    neat          = require('node-neat').includePaths;

var include       = require('gulp-include'),
    uglify        = require('gulp-uglify');

var cheerio       = require('gulp-cheerio'),
    svgstore      = require('gulp-svgstore'),
    svgmin        = require('gulp-svgmin'),
    path          = require('path');

var webpackstream = require('webpack-stream');

var browserSync   = require('browser-sync').create(),
    reload        = browserSync.reload;

// Url -------------------------------------------------------------------------

var url           = 'http://landhostudio.dev/';

// Paths -----------------------------------------------------------------------

var source        = './src',
    destination   = './dist';

// Stylesheets -----------------------------------------------------------------

var AUTOPREFIXER_BROWSERS = {
  browsers: [
    'last 3 versions',
    'ie 11',
    'ie 10',
    'ios >= 7',
    'android >= 4'
  ]
};

gulp.task('css', function() {
  gulp.src(source + '/stylesheets/**/*.{scss,sass}')
    .pipe(sass({
      includePaths: bourbon,
      includePaths: neat,
      precision: 6
    }).on('error', sass.logError))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(combineMq())
    .pipe(csscomb())
    .pipe(cssnano())
    .pipe(gulp.dest(destination + '/css'))
    .pipe(browserSync.stream());
});

// Scripts ---------------------------------------------------------------------

gulp.task('js', function() {
  return gulp.src([source + '/scripts/{all-bottom,all-top}.js'])
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest(destination + '/js'))
    .pipe(browserSync.stream());
});

// Icons -----------------------------------------------------------------------

gulp.task('icons', function() {
  return gulp.src(source + '/images/**/*.svg')
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          removeDoctype: true
        }, {
          removeComments: true
        }, {
          cleanupIDs: {
            prefix: prefix + '-',
            minify: false
          }
        }]
      }
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio(function($) {
      $('[fill]').removeAttr('fill');
      $('svg').attr('display', 'none');
    }))
    .pipe(gulp.dest(destination + '/img'))
    .pipe(browserSync.stream());
});

// Icons -----------------------------------------------------------------------

gulp.task('images', function() {
  return gulp.src(source + '/images/**/*.{svg,png,ico,gif}')
    .pipe(gulp.dest(destination + '/img'))
    .pipe(browserSync.stream());
});

// Fonts -----------------------------------------------------------------------

gulp.task('fonts', function() {
  return gulp.src(source + '/webfonts/**/*')
    .pipe(flatten())
    .pipe(gulp.dest(destination + '/webfonts'))
    .pipe(browserSync.stream());
});

// Watch -----------------------------------------------------------------------

gulp.task('watch', function() {
  browserSync.init({
    files: ['{inc,template-pages,templates-parts}/**/*.php', '*.php'],
    proxy: url,
    notify: false,
    port: 2016,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: {
        submit: false,
        inputs: false,
        toggles: false
      }
    },
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['/wp-admin/**']
    }
  });

  gulp.watch(source + '/stylesheets/**/*.{scss,sass}', ['css']);
  gulp.watch(source + '/scripts/**/*.js', ['js']);
  gulp.watch(source + '/images/**/*.svg', ['icons']);
  gulp.watch(source + '/webfonts/**/*', ['fonts']);
  gulp.watch(source + '/images/**/*.{jpg,jpeg,gif,png}', ['img']);
  gulp.watch(['build']);
});

// Clear -----------------------------------------------------------------------

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

// Build -----------------------------------------------------------------------

gulp.task('build', function(callback) {
  runSequence('clear', 'css', 'js', 'icons', 'images', 'fonts', callback);
});

// Gulp ------------------------------------------------------------------------

gulp.task('default', function() {
  gulp.start('build');
});
