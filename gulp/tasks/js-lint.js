module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap, confPlugins, gulpif, pathFiles, notify
) {
  return function() {

  	if (confGlobal.enableESLinting) {
    
	    var ref = confFileMap.sourceFiles.js;

	    notify('Linting: ' + pathFiles(settings.sourceFolder, ref), 'title');

	    var fs = require('fs');

	    return gulp.src(pathFiles(settings.sourceFolder, ref))
	      .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))

	      /*
	       * Linting
	       */

	      .pipe(gulpif(confGlobal.enableESLinting, plugins.eslint(confPlugins.eslint)))
	      .pipe(gulpif(confGlobal.enableESLinting, plugins.eslint.format())
	      .pipe(gulpif((confGlobal.enableESLinting && confGlobal.enableESLintLogging), plugins.eslint.format('html', 

	      	fs.createWriteStream('./reports/eslint.'+ settings.timeStamp +'.html') 

	      ))))

	      .pipe(gulpif(settings.isDevelop, plugins.eslint.result(function (result) {
	      	if (result.errorCount + result.warningCount > 0) {
	      		for (msg in result.messages) {
	      			var handle = result.messages[msg],
						msgSeverity = (handle.severity === 2) ? 'Error' : 'Warning';
						msgColour = 'lint' + msgSeverity,
						
						msgLine = result.filePath;
						msgLine += '\n'+ msgSeverity +': '+ handle.message;
						msgLine += '\nLine, column: '+ handle.line + ':' + handle.column;
						
	      			notify(msgLine, msgColour);
	      		}
	      		notify('Linting failed for '+ result.filePath + ' with '+ result.warningCount + ' warning(s) and ' + result.errorCount + ' error(s).', 'error');
			} else {
	      		notify('Linting passed for '+ result.filePath, 'success');
			}

	      })))
	      .pipe(plugins.eslint.results(function (results) {

	      	notify('Files processed:'+ results.length, 'title');
	      	notify('Total warnings: '+ results.warningCount, 'title');
	      	notify('Total errors:   '+ results.errorCount, 'title');

	      	if ( ( (results.errorCount > 0) && confGlobal.failBuildOnLintError) && (!settings.isDevelop)){
	      		if (settings.args.force) {
	      			notify('The build has been forced, but contains warning(s) and/or error(s): please refer to the error log in the reports folder.', 'error');
	      		} else {
	      			notify('The build has failed: please refer to the error log in the build folder.', 'error');
	      			notify('Use the -f or -force argument to ignore lint errors while building.', '');
	      		}
	      	}

	      }))

	      // Brick on failure to be super strict
	      .pipe(gulpif( (!settings.isDevelop && confGlobal.failOnBuildErrors && !(settings.args.force) ), plugins.eslint.failAfterError()))
	      ;

	  }

  };
};
