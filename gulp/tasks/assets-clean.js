module.exports = function(
  gulp, settings, confGlobal, confFileMap, notify
) {
  return function() {

    if (confGlobal.cleanBeforeRun && !settings.isDevelop) {

      var assets = confFileMap.assets,
          delAssets = [];

      var del = require('del');
      notify('Deleting copied assets from ' + settings.targetFolder + ':', 'title');

      for (item in assets) {
        notify('Deleting '+ assets[item].name +': ' + settings.targetFolder + assets[item].folderTo + assets[item].searchPattern, 'title');
        delAssets.push(settings.targetFolder + assets[item].folderTo + assets[item].searchPattern);
      }

      if (delAssets.length > 0) {
        return del(delAssets);
      }

    }

  };
};
