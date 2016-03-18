module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap
) {
  return function() {
    if (confGlobal.enableRevisioning) {

      var manifest = gulp.src(confFileMap.targetFolders.revManifest + confFileMap.targetFiles.revManifest);
	  
      return gulp.src(settings.targetFolder + confFileMap.sourceFiles.index)
        .pipe(plugins.revReplace({
          manifest: manifest
        }))
        .pipe(gulp.dest(settings.targetFolder + confFileMap.targetFolders.html));
    }
  };
};
