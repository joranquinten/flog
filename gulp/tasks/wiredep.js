module.exports = function(
  gulp, settings, plugins, confFileMap, gulpif, reload, pathFiles, notify
) {
  return function() {
    var ref = confFileMap.sourceFiles.index;

    notify('Wiring up dependencies from Bower...', 'title');

    var wiredep = require('wiredep').stream;

    return gulp.src(pathFiles(settings.sourceFolder, ref))
      .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))
      .pipe(wiredep())
      .pipe(gulpif(settings.isDevelop,  gulp.dest(settings.sourceFolder + confFileMap.targetFolders.html)))
      .pipe(gulpif(!settings.isDevelop, gulp.dest(settings.targetFolder + confFileMap.targetFolders.html)))
      ;
  };
};
