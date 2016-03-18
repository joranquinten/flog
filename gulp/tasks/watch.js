module.exports = function(
  gulp, settings, plugins, confFileMap, notify
) {
  return function() {

	if (settings.nowatch) {
  
		var watchPath = confFileMap.watchFiles;
		var watchFiles = [].concat(watchPath.css, watchPath.js, watchPath.html, watchPath.images);

		notify('Watching '+ watchFiles +' in '+ settings.sourceFolder, 'title');
		notify('Disable watching with the argument -nowatch | -nw', '');

		plugins.watch(settings.sourceFolder + watchPath.css, function() {
		  gulp.run(['css']);
		});

		plugins.watch(settings.sourceFolder + watchPath.js, function() {
		  gulp.run(['js']);
		});

		plugins.watch(settings.sourceFolder + watchPath.html, function() {
		  gulp.run(['html']);
		});

		plugins.watch(settings.sourceFolder + watchPath.images, function() {
		  gulp.run(['img']);
		});
	
	} else {
		notify('Watching disabled.', 'title');
	}
	
  };
};
