module.exports = function(
  gulp, settings, plugins, confGlobal, confFileMap, gulpif, pathFiles, notify
) {
  return function() {

    var pngquant = require('imagemin-pngquant');
    var ref = confFileMap.sourceFiles.images;

    return gulp.src(pathFiles(settings.sourceFolder, ref))
      .pipe(gulpif(!settings.isDevelop, plugins.imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        use: [pngquant()]
      }))) // Minify only on prod
      .pipe(gulpif(!settings.isDevelop, gulp.dest(settings.targetFolder + confFileMap.targetFolders.images)));
  };
};
