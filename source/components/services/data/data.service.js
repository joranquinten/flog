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
            removeFromLocalData : removeFromLocalData,
            getFromStoredData : getFromStoredData,
            exportFromStoredData : exportFromStoredData
        }

        return service;

        ////////////////

        function saveSnap(data, successCallback, errorCallback) {

            $http({
                method: 'POST',
                url: '../server/snapSave.php',
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

        function getFromStoredData(data) {

            return $http({
                    method: 'POST',
                    url: '../server/getSavedSnaps.php',
                    data: data
                })
                .then(getFromStoredDataComplete);

            function getFromStoredDataComplete(data) {
                return data.data;
            }

        }

        function exportFromStoredData(data) {

            return $http({
                    method: 'POST',
                    url: '../server/exportSavedSnaps.php',
                    data: data
                }).then(exportFromStoredDataComplete);

            function exportFromStoredDataComplete(data) {

                var filename, timestamp, extension;
                timestamp = moment(new Date()).format('YYYYMMDDHHmmss');
                extension = '.csv';
                filename = 'export-'+ timestamp + extension;

                var blob = new Blob([data.data], { type:"application/octet-stream;charset=utf-8;" });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href',window.URL.createObjectURL(blob));
                downloadLink.attr('download', filename);
                downloadLink[0].click();
            }

        }

        function deleteFromStoredData(data) {

            return $http({
                    method: 'POST',
                    url: '../server/deleteSavedSnaps.php',
                    data: data
                })
                .then(deleteFromStoredData);

            function deleteFromStoredData(data) {
                return data.data;
            }

        }

    }

})();

