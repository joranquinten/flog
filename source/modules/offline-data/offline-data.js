(function() {

  'use strict';

  angular
    .module('app.offlineData')
    .controller('offlineData', offlineData);

  /* @ngInject */
  function offlineData($scope, $cookies, $window, toastr, dataService) {

    var vm = this;

    vm.removeLocalDataItem = removeLocalDataItem;
    vm.removeLocalData = removeLocalData;
    vm.saveLocalDataItem = saveLocalDataItem;
    vm.saveLocalData = saveLocalData;

    vm.localData = localData();
    vm.hasLocalData = hasLocalData();

    ////////////////


    //////////////////// Public

    function removeLocalDataItem (index) {
        dataService.removeFromLocalData('stagedSnaps', index)
        vm.localData = localData();
    }

    function removeLocalData () {
        $window.localStorage.removeItem('stagedSnaps');
        vm.localData = null;
        toastr.info('Offline data purged.');
    }

    function saveLocalData () {
        var a = [];
            a = angular.fromJson($window.localStorage.getItem('stagedSnaps'));

        angular.forEach(a, function(value, key) {
          saveLocalDataItem (value, key);
        }, function(){ toastr.info('Done iterating'); });

    }

    function saveLocalDataItem (item, index) {

        var data = {
                "cameraId" : item.cameraId || null,
                "lensId" : item.lensId || null,
                "fileName" : item.fileName || null,
                "seriesName" : item.seriesName || null,
                "focalLength" : item.focalLength || null,
                "focalDistance" : item.focalDistance || null,
                "apertureSize" : item.apertureSize || null,
                "fileDate" : item.fileDate || null,
                "locationLat" : item.locationLat || null,
                "locationLong" : item.locationLong || null,
                "snapNotes" : item.snapNotes || null
            };


        dataService.saveSnap(
            data,
            function() {
                removeLocalDataItem (index);
                toastr.success('File '+ item.fileName +' saved.');
            },
            function () {
                toastr.error('File '+ item.fileName +' not saved. Keep in offline data.');
            }
        );

    }

    //////////////////// Private functions



    ////////// Data sources

    function localData () {

        return dataService.getFromLocalData('stagedSnaps');

    }

    ////////// Data settings

    function hasLocalData () {
      return ($window.localStorage.getItem('stagedSnaps') !== null);
    }

    ////////// View settings

    ////////// Watchers on the wall

    ////////// Local storage / cookies

  }

})();
