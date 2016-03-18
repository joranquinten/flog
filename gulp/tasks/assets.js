module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap, notify
) {
  return function() {

    if (!settings.isDevelop) {

      var assets = confFileMap.assets;

      notify('Copying assets to ' + settings.targetFolder + ':', 'title');



/*
      for (item in assets) {
        return gulp.src( assets[item].folderFrom + assets[item].searchPattern )
          .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))
          .pipe(gulpif(!settings.isDevelop, gulp.dest( assets[item].folderTo )));
      }
*/



    var x = 0;
    var loopList = function(arr)  {
      copyAsset(arr[x], function(){
        x++;
        if (x < arr.length) { loopList(arr); }
      });
    }

    function copyAsset(asset, callback) {
      
      notify('Copying '+ asset.folderFrom + asset.searchPattern +' to '+ settings.targetFolder + asset.folderTo, 'title');
      return gulp.src( asset.folderFrom + asset.searchPattern )
          .pipe(plugins.plumber({ handleError: function(err) { notify(err, 'error'); } }))
          .pipe(gulp.dest( settings.targetFolder + asset.folderTo ))
          .on('end', callback );
    }

    loopList(assets);


    }
    
  };
};
