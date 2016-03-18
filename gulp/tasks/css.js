module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify
) {
  return function() {
    // PostCSS plugins
    var autoprefixer = require('autoprefixer');
    var cssgrace = require('cssgrace');
    var pseudoelements = require('postcss-pseudoelements');
    var reporter = require("postcss-reporter");

    // Define PostCSS plugins
    var postprocessors = [
      autoprefixer(confPlugins.autoprefixer),
      cssgrace,
      pseudoelements,
      reporter(confPlugins.reporter)
    ];

    return gulp.src(pathFiles(settings.sourceFolder, confFileMap.sourceFiles.css))
      .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))
      .pipe(plugins.concat(confFileMap.targetFiles.css))
      .pipe(plugins.postcss(postprocessors))
      .pipe(gulpif(!settings.isDevelop, plugins.minifyCss({ compatibility: 'ie8' })))
      .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))

      .pipe(gulpif(!settings.isDevelop, gulp.dest(settings.targetFolder + confFileMap.targetFolders.css)))
      .pipe(reload({ stream: true }));
  };
};
