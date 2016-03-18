module.exports = function(
  gulp, settings, confPlugins, browserSync, confLocal, notify
) {
  return function() {

    if (!settings.noserve) {

      if (settings.isDevelop) {
        var env = settings.sourceFolder.replace('./', '');
      } else {
        var env = settings.targetFolder.replace('./', '');
      }

      notify('Serve assumes you have a local webserver running and content is accessible via localhost.', 'title');
      notify('Disable serving with the argument -noserve | -ns.', '');

      var serverUrl, browserList;
      serverUrl = confPlugins.browserSync.proxy;
      browserList = confPlugins.browserSync.browsers;

      // Overwrite with local settings is applicable
      if (confLocal.server) serverUrl = confLocal.server;
      if (confLocal.browsers) browserList = confLocal.browsers;

      //serverUrl = transformUrl(serverUrl, env)

      browserSync.init({ server: false, proxy: serverUrl, browser: browserList });

      // Settings to use a static server:
      //browserSync.init({server: { baseDir: './' }, browser: browserList });


    } else {

      notify('Serving is disabled.', 'title');

    }

      function transformUrl(tmpUrl) {
        
        if ((tmpUrl.indexOf(settings.sourceFolder) < 0) && (tmpUrl.indexOf(settings.targetFolder) < 0)) {
          // No specific build of source folder defined, add to serve URL
          var tmp = tmpUrl.split( /(\/|\#|\?)/ig );
          tmp.splice((tmp.lastIndexOf('/') + 1), 0, env);
          return tmp.join('');
        } else {
          return tmpUrl;
        }

      }

  };
};