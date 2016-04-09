(function () {

    'use strict';

    angular
        .module('app.core')
        .factory('GoogleMapsInitializer', GoogleMapsInitializer);

    /* @ngInject */
    function GoogleMapsInitializer($window, $q) {

        //Google's url for async maps initialization accepting callback function
        var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBDYcvyQQP1UehR1tPPGXiy9YKhqaiNQEk&callback=',
            mapsDefer = $q.defer();

        //Callback function - resolving promise after maps successfully loaded
        $window.googleMapsInitialized = mapsDefer.resolve; // removed ()

        //Async loader
        var asyncLoad = function(asyncUrl, callbackName) {
          var script = document.createElement('script');
          //script.type = 'text/javascript';
          script.src = asyncUrl + callbackName;
          document.body.appendChild(script);
        };
        //Start loading google maps
        asyncLoad(asyncUrl, 'googleMapsInitialized');

        //Usage: Initializer.mapsInitialized.then(callback)
        return {
            mapsInitialized : mapsDefer.promise
        };

    }
})();
