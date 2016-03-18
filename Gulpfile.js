/*
[] Serving
[] Help
[] Testing
[] Review
*/

require('es6-promise').polyfill();

/* ****************************************************************************************************
*  Variables                                                                                          *
**************************************************************************************************** */

var confGlobal = require('./gulp/config/gulp-global.json');
var confFileMap = require('./gulp/config/gulp-filemap.json');
var confPlugins = require('./gulp/config/gulp-plugins.json');
var confLocal = require('./gulp/config/gulp-local.json');

var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/ });
var args = require('yargs').argv;
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var del = require('del');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

var settings = {
    isDevelop : true,
    args : args
}

/* ****************************************************************************************************
*  Helpers                                                                                            *
**************************************************************************************************** */

var ignorePath = function(base, file) {
  if (file.substring(0, 1) === '!') {
    return '!' + base + '' + file.replace('!', '');
  }
  return base + '' + file;
};

var currentDir = function() {
  if (__dirname) return __dirname.split('\\').pop();
};

var notify = function(msg, type) {
  if (typeof(plugins.util) !== undefined) {
    switch (type) {
      case 'warning':
        plugins.util.log(plugins.util.colors.yellow(msg));
        break;
      case 'error':
        plugins.util.log(plugins.util.colors.bgRed(msg));
        break;
      case 'lintError':
        plugins.util.log(plugins.util.colors.red(msg));
        break;
      case 'lintWarning':
        plugins.util.log(plugins.util.colors.cyan(msg));
        break;
      case 'success':
        plugins.util.log(plugins.util.colors.green(msg));
        break;
      case 'title':
        plugins.util.log(plugins.util.colors.blue(msg));
        break;
      case 'important':
        plugins.util.log(plugins.util.colors.bgGreen(msg));
        break;
      default:
        plugins.util.log(plugins.util.colors.cyan(msg));
    }
  } else {
    if (type !== undefined) msg = '[' + type + ']: ' + msg;
    console.log(msg);
  }
};

var pathFiles = function(base, collection) {
  if (typeof(collection) === 'object') {
    var ar = [];
    for (var i = 0; i < collection.length; i++) {
      ar.push(ignorePath(base, collection[i]));
    }
    return ar;
  } else if (typeof(collection) === 'string') {
    return ignorePath(base, collection);
  }
};

var fileExists = function(filepath){
  var fs = require('fs');
  try {
    file = fs.lstatSync(filepath);
    if (file.isFile()) {
      try {
        return true;
      } catch (e) {
        return false;
      }
    }
  } catch (e) {return false;
  }
};

var getTimestamp = function(){
  var rightNow = new Date();
  return rightNow.toISOString().slice(0, 17).replace(/-/g, "").replace(/T/g, "").replace(/:/g, "");
}
settings.timeStamp = getTimestamp();

var getArgs = settings.args;

if (getArgs.b !== undefined) getArgs.build = (getArgs.build) ? getArgs.build : getArgs.b;
settings.isDevelop = (getArgs.build === undefined) ? true : false;

if (getArgs.f !== undefined) getArgs.force = (getArgs.force) ? getArgs.force : getArgs.f;
settings.force = (getArgs.force === undefined) ? false : true;

if (getArgs.nw !== undefined) getArgs.nowatch = (getArgs.nowatch) ? getArgs.nowatch : getArgs.nw;
settings.nowatch = (getArgs.nowatch != undefined) ? false : true;

if (getArgs.ns !== undefined) getArgs.noserve = (getArgs.noserve) ? getArgs.noserve : getArgs.ns;
settings.noserve = (getArgs.noserve === undefined) ? false : true;

if (getArgs.r !== undefined) getArgs.rev = (getArgs.rev) ? getArgs.rev : getArgs.r;
confGlobal.enableRevisioning = (getArgs.rev === undefined) ? confGlobal.enableRevisioning : true;

if (settings.isDevelop) {
    // Develop
    settings.sourceFolder = confFileMap.env.dev.base;
    settings.targetFolder = confFileMap.env.dev.dest;
} else {
    // Build
    settings.sourceFolder = confFileMap.env.prod.base;
    settings.targetFolder = confFileMap.env.prod.dest;
}

/* ****************************************************************************************************
*                                                                                                     *
*  MAIN TASKS                                                                                         *
*                                                                                                     *
**************************************************************************************************** */

gulp.task('default', ['help']);

gulp.task('help', function(){

  var helpMsg = '\n';
  helpMsg += '\n  This project builds a boilerplate HTML5 project. Clone to a new repo to start developing.';
  helpMsg += '\n';
  helpMsg += '\n  A list of available commands:';
  helpMsg += '\n';
  helpMsg += '\n    gulp dev   [-b|-nw]    > Starts development process of current project';
  helpMsg += '\n    gulp build [-ns|-r|-f] > Builds current project';
  helpMsg += '\n    gulp clean             > Empties all files in the build folder';
  helpMsg += '\n';
  helpMsg += '\n  The following arguments are available for build or dev tasks:';
  helpMsg += '\n    -build   | -b          > Enables build-like settings (useful for debugging dev tasks)';
  helpMsg += '\n    -nowatch | -nw         > Disables the automated watch task (after dev)';
  helpMsg += '\n    -noserve | -ns         > Disables the automated serving task (after build)';
  helpMsg += '\n    -rev     | -r          > Forces revisioning or cache busting (on build)';
  helpMsg += '\n    -force   | -f          > Forces build, ignores linting errors (on build)';
  helpMsg += '\n';

  notify(helpMsg, 'title');

});

gulp.task('dev', require('./gulp/tasks/dev.js') (gulp, settings, runSequence, notify));
gulp.task('build', require('./gulp/tasks/build.js') (gulp, settings, confGlobal, runSequence, notify));

gulp.task('html', ['wiredep'], require('./gulp/tasks/html.js') (gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify));
gulp.task('html-clean', require('./gulp/tasks/html-clean.js') (gulp, settings, confGlobal, confFileMap, notify));
gulp.task('html:assets', ['js', 'css', 'img', 'assets']);

gulp.task('wiredep', ['html-clean'], require('./gulp/tasks/wiredep.js') (gulp, settings, plugins, confFileMap, gulpif, reload, pathFiles, notify));
gulp.task('rev', ['rev:manifest'], require('./gulp/tasks/rev.js') (gulp, confGlobal, notify));
gulp.task('rev:manifest', ['rev:revision'],    require('./gulp/tasks/rev-manifest.js') (gulp, settings, plugins, confGlobal, confFileMap));
gulp.task('rev:revision', ['rev:clean'], require('./gulp/tasks/rev-revision.js')    (gulp, settings, plugins, confGlobal, confFileMap));
gulp.task('rev:clean', require('./gulp/tasks/rev-clean.js') (gulp, settings, confGlobal, confFileMap, notify));


gulp.task('js', ['js-lint'], require('./gulp/tasks/js.js')(gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify));
gulp.task('js-lint', ['js-clean'], require('./gulp/tasks/js-lint.js') (gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, pathFiles, notify));
gulp.task('js-clean', require('./gulp/tasks/js-clean.js')(gulp, settings, confGlobal, confFileMap, notify));

gulp.task('css', ['css-lint'], require('./gulp/tasks/css.js')(gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify));
gulp.task('css-lint', ['css-clean'], require('./gulp/tasks/css-lint.js') (gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify));
gulp.task('css-clean', require('./gulp/tasks/css-clean.js')(gulp, settings, confGlobal, confFileMap, notify));

gulp.task('img', ['img-clean'], require('./gulp/tasks/img.js')(gulp, settings, plugins, confGlobal, confFileMap, gulpif, pathFiles, notify));
gulp.task('img-clean', require('./gulp/tasks/img-clean.js')(gulp, settings, confGlobal, confFileMap, notify));

gulp.task('assets', ['assets-clean'], require('./gulp/tasks/assets.js')(gulp, settings, plugins, confGlobal, confFileMap, notify));
gulp.task('assets-clean', require('./gulp/tasks/assets-clean.js')(gulp, settings, confGlobal, confFileMap, notify));

gulp.task('watch', require('./gulp/tasks/watch.js') (gulp, settings, plugins, confFileMap, notify));

gulp.task('serve', require('./gulp/tasks/serve.js') (gulp, settings, confPlugins, browserSync, confLocal, notify));

gulp.task('clean', require('./gulp/tasks/clean.js') (gulp, settings, del, notify));


