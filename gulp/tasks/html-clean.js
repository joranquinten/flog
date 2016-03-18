module.exports = function(
  gulp, settings, confGlobal, confFileMap, notify
) {
  return function() {

    if (confGlobal.cleanBeforeRun && !settings.isDevelop) {
      var del = require('del');
      notify('Deleting: ' + settings.targetFolder + confFileMap.targetFolders.html + '**/*.{html,htm,xml,txt}', 'title');
      return del(settings.targetFolder + confFileMap.targetFolders.html + '**/*.{html,htm,xml,txt}');
    }

  };
};
