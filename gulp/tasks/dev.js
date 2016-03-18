module.exports = function(
  gulp, settings, runSequence, notify
) {
  return function() {
    settings.isDevelop = true;
    settings.force = true;

    notify('Running develop script...', 'title');

    runSequence('html:assets', 'html', 'serve', 'watch');
  };
};
