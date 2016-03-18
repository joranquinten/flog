(function () {

    'use strict';

    angular
        .module('app.log')
        .factory('logService', logService);

    /* @ngInject */
    function logService() {

        var service = {
            getLenses: getLenses,
            getApertures: getApertures
        }

        return service;

        ////////////////

        function getLenses() {
            return [
                { "lensName": "Sony 16/55mm" },
                { "lensName": "Samyang 12mm" },
                { "lensName": "Sigma 19mm" }
            ];
        }

        function getApertures() {

        }
    }

})();
