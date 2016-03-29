(function () {

    'use strict';

    angular
        .module('app.log')
        .factory('logService', logService);

    /* @ngInject */
    function logService() {

        var service = {
            getCameras: getCameras,
            getLenses: getLenses,
            getApertures: getApertures
        }

        return service;

        ////////////////

        function getCameras() {
            return [
                { "cameraName": "Sony a6000", "typeName": "ILCE-6000" }
            ];
        }

        function getLenses() {
            return [
                { "lensName": "Sony 16/55mm", "maxAperture" : 3.5, "minAperture": 20 },
                { "lensName": "Samyang 12mm", "maxAperture" : 2, "minAperture": 20 },
                { "lensName": "Sigma 19mm", "maxAperture" : 2.8, "minAperture": 20 },
                { "lensName": "Sigma 30mm", "maxAperture" : 2.8, "minAperture": 20 }
            ];
        }

        function getApertures() {
            return [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64];
        }
    }

})();

