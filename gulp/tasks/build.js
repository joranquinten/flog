module.exports = function(
  gulp, settings, confGlobal, runSequence, notify
) {
  return function() {
    settings.isDevelop = false;

    notify('Running build script...', 'title');

    runSequence('html:assets', 'html', 'rev', 'serve'); // 'rev' before serve 
    
  };
};
