module.exports = function(
  gulp, settings, confGlobal, confFileMap, notify
) {
  return function() {
	
    if (confGlobal.cleanBeforeRun && !settings.isDevelop) {
      var del = require('del');
      notify('deleting: ' + settings.targetFolder + confFileMap.targetFolders.images + '**/*.{gif,png,jpeg,jpg,svg}', 'title');
      return del(settings.targetFolder + confFileMap.targetFolders.images + '**/*.{gif,png,jpeg,jpg,svg}');
    }

  };
};
