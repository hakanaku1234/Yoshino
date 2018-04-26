const gulp = require('gulp');
const postcss = require('gulp-postcss');
const less = require('gulp-less');
const path = require('path');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 10 versions'] });
const cleanCSS = require('gulp-clean-css');
const allComponents = require('./allComponents');

gulp.task('less', function () {
  return gulp.src(path.resolve('../components/styles/index.less'))
    .pipe(less({
      plugins: [autoprefix],
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.resolve('../lib')));
});

gulp.task('font', function () {
  return gulp.src(path.resolve('../components/styles/common/iconfont/fonts/*'))
    .pipe(gulp.dest(path.resolve('../lib/fonts')));
});

// 单个组件打包less
allComponents.forEach((component) => {
  gulp.task(component, function () {
    return gulp.src(path.resolve(`../components/${component}/style/index.less`))
      .pipe(less({
        plugins: [autoprefix],
      }))
      .pipe(cleanCSS())
      .pipe(gulp.dest(path.resolve(`../lib/components/${component}`)));
  });
})

gulp.task('default', ['less', 'font', ...allComponents]);