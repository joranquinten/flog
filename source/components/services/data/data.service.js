(function () {

    'use strict';

    angular
        .module('app.core')
        .factory('dataService', dataService);

    /* @ngInject */
    function dataService($http, $window) {

        var service = {
            saveSnap: saveSnap,
            addToLocalData : addToLocalData,
            getFromLocalData : getFromLocalData,
            removeFromLocalData : removeFromLocalData
        }

        return service;

        ////////////////

        function saveSnap(data, successCallback, errorCallback) {

            $http({
                method: 'POST',
                url: '../server/snapSave..php',
                data: data
            }).then(function success() {
                successCallback();
            }, function error() {
                errorCallback();
            });
        }

        function addToLocalData(key, data) {

            if (angular.isDefined(key) && angular.isDefined(data)) {
                var a = [];
                if ($window.localStorage.getItem(key) !== null) a = angular.fromJson($window.localStorage.getItem(key));
                a.push(data);
                $window.localStorage.setItem(key, angular.toJson(a));
            }

        }

        function getFromLocalData (key) {
            if (angular.isDefined(key)) {
                var a = [];
                if ($window.localStorage.getItem(key) !== null) a = angular.fromJson($window.localStorage.getItem(key));
                return a;
            }
        }

        function removeFromLocalData(key, index) {

            if (index > -1){
                var a = [];
                a = angular.fromJson($window.localStorage.getItem(key));
                a.splice(index, 1);
                $window.localStorage.setItem(key, angular.toJson(a));
            }

        }

    }

})();

