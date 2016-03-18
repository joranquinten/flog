module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, notify
) {
  return function() {
    // PostCSS plugins
    var stylelint = require('stylelint');
    var reporter = require("postcss-reporter");

    // Define PostCSS plugins
	var throwErrors = ( (settings.isDevelop || confGlobal.failOnBuildErrors)  && !settings.force) ? true : false;
	
	confPlugins.reporter = {
		"clearMessages": true,
		"throwError" : throwErrors,
		"noIcon" : true,
		"noPlugin" : true
	}
	
    // Rules are defined on: http://stylelint.io/?docs/user-guide/rules.md
    var preprocessors = [
      stylelint(confPlugins.stylelint),
      reporter(confPlugins.reporter)
    ];

    return gulp.src(pathFiles(settings.sourceFolder, confFileMap.sourceFiles.css))
      .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))
      .pipe(plugins.postcss(preprocessors));
  };
};
