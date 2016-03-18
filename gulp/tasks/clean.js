module.exports = function(
  gulp, settings, del, notify
) {
  return function() {
    settings.isCleanedProd = true;
    notify('Cleaning production environment...', 'title');
    return del([settings.targetFolder + '/**/*','!'+ settings.targetFolder + '/**/*.svn']);
  };
};
