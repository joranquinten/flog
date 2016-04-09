(function () {

    'use strict';

    angular
        .module('app.core')
        .factory('devicesService', devicesService);

    /* @ngInject */
    function devicesService($http) {

        var service = {
            getCameras: getCameras,
            getLenses: getLenses,
            getApertures: getApertures
        }

        return service;

        ////////////////

        function getCameras() {
            return $http.get('../server/getCameras.php').then(function(response){
                return angular.fromJson(response.data.cameras);
            });
        }

        function getLenses(camera_id) {
            return $http.get('../server/getLenses.php?camera_id='+ camera_id).then(function(response){
                return angular.fromJson(response.data.lenses);
            });
        }

        function getApertures(lens_id) {
            return $http.get('../server/getApertures.php?lens_id='+ lens_id).then(function(response){
                return angular.fromJson(response.data.apertures);
            });
        }
    }

})();

