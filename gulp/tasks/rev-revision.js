module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap
) {
  return function() {
	  
    if (confGlobal.enableRevisioning) {
		
		var manifest = confFileMap.targetFolders.revManifest;
		
		// Load files to be revisioned
		return gulp.src(settings.targetFolder + '**/*.{css,js}')
		  .pipe(plugins.plumber({ handleError: function(err) { console.log(err); this.emit('end'); } }))
		  .pipe(plugins.rev())
		  .pipe(gulp.dest(settings.targetFolder))
		  .pipe(plugins.rev.manifest({
			path: confFileMap.targetFiles.revManifest
		  }))
		  .pipe(gulp.dest(manifest));
	  
	}
  };
};
