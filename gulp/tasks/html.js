module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify
) {
  return function() {
    var ref = confFileMap.sourceFiles.html;

    var postFix = '.'+ confFileMap.targetFiles.templatePostfix;

    var del = require('del');

    if (confGlobal.cleanBeforeRun && !settings.isDevelop) {
      notify('Deleting: ' + settings.targetFolder + confFileMap.targetFolders.html + '**/*.{html,htm,xml,txt}', 'title');
      del(settings.targetFolder + confFileMap.targetFolders.html + '**/*.{html,htm,xml,txt}');
    }

    if (!settings.isDevelop && confGlobal.enableUserefOnBuild) {
      notify('Retrieving and building external assets. This may take a while...', 'title');
    }

    return gulp.src(pathFiles(settings.sourceFolder, ref))
      .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))

      .pipe(gulpif( !settings.isDevelop && confGlobal.enableUserefOnBuild, plugins.useref({  })))

      .pipe(gulpif( (!settings.isDevelop && confGlobal.enableUserefOnBuild && '*.js'), plugins.uglify()))
      //.pipe(gulpif( (!settings.isDevelop && confGlobal.enableUserefOnBuild && '*.css'), plugins.minifyCss()))

      .pipe(gulpif(!settings.isDevelop && confGlobal.minifyHTML, plugins.htmlmin(confPlugins.minifyHTML)))
      .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
      .pipe(gulpif(!settings.isDevelop, gulp.dest(settings.targetFolder + confFileMap.targetFolders.html)))
      .pipe(reload({ stream: true }));
  };
};
