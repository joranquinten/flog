module.exports = function(
  gulp, confGlobal, notify
) {
  return function() {
    if (!confGlobal.enableRevisioning) {
    	notify('Revisioning (or cache busting) is disabled. Enable with -rev | -r argument.', '');
	}
  };
};
