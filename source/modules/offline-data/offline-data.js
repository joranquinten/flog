(function() {

  'use strict';

  angular
    .module('app.offlineData')
    .controller('offlineData', offlineData);

  /* @ngInject */
  function offlineData($http, $scope, $cookies, $window, toastr) {

    var vm = this;

    vm.removeLocalDataItem = removeLocalDataItem;
    vm.removeLocalData = removeLocalData;
    vm.saveLocalData = saveLocalData;

    vm.localData = localData();
    vm.hasLocalData = hasLocalData();

    ////////////////


    //////////////////// Public

    function removeLocalDataItem (index) {
        if (index > -1){
            var a = [];
            a = angular.fromJson($window.localStorage.getItem('stagedSnaps'));
            a.splice(index, 1);
            $window.localStorage.setItem('stagedSnaps', angular.toJson(a));
            // reset
            vm.localData = localData();
        }
    }

    function removeLocalData () {
        $window.localStorage.removeItem('stagedSnaps');
        toastr.info('Offline data purged.');
    }

    function saveLocalData () {
        toastr.info('Should iterate over localStorage and address save-page. If successfull, remove from localStorage, otherwise keep.');

        var a = [];
            a = angular.fromJson($window.localStorage.getItem('stagedSnaps'));

        angular.forEach(a, function(value, key) {
            console.log(value, key)
          saveLocalDataItem (value, key);
        }, function(){ toastr.info('Done iterating'); });

        function saveLocalDataItem (item, index) {

            var url = '../server/snapSave.php',
                data = {
                    "cameraId" : item.cameraId,
                    "lensId" : item.lensId,
                    "fileName" : item.fileName,
                    "seriesName" : item.seriesName,
                    "focalLength" : item.focalLength,
                    "focalDistance" : item.focalDistance,
                    "apertureSize" : item.apertureSize,
                    "fileDate" : item.fileDate,
                    "locationLat" : item.locationLat,
                    "locationLong" : item.locationLong
                };

            $http({
                method: 'POST',
                url: url,
                data: data
                }).then(function successCallback() {
                    removeLocalDataItem (index);
                    toastr.success('File '+ item.fileName +' saved.');
                }, function errorCallback() {
                    toastr.error('File '+ item.fileName +' not saved. Keep in offline data.');
                });

        }

    }

    //////////////////// Private functions

    ////////// Data sources

    function localData () {

        var a = [];
        if ($window.localStorage.getItem('stagedSnaps') !== null) a = angular.fromJson($window.localStorage.getItem('stagedSnaps'));
        return a;

    }

    ////////// Data settings

    function snapSaveOffline (data) {

        var a = [];
        if ($window.localStorage.getItem('stagedSnaps') !== null) a = angular.fromJson($window.localStorage.getItem('stagedSnaps'));
        a.push(data);
        $window.localStorage.setItem('stagedSnaps', angular.toJson(a));

    }

    function hasLocalData () {
      return ($window.localStorage.getItem('stagedSnaps') !== null);
    }

    ////////// View settings

    ////////// Watchers on the wall

    ////////// Local storage / cookies

  }

})();
