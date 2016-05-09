(function() {

  'use strict';

  angular
    .module('app.exportData')
    .controller('exportData', storedData);

  /* @ngInject */
  function storedData(toastr, dataService) {

    var vm = this;

    vm.exportStoredData = exportStoredData;

    vm.storedData = storedData();
    vm.toggleSelect = toggleSelect;

    ////////////////


    //////////////////// Public

    function exportStoredData () {
        dataService.exportFromStoredData();
    }

    function toggleSelect($event) {
        console.log($event)

    }

    //////////////////// Private functions

    ////////// Data sources

    function storedData () {
        var data = {};
        return dataService.getFromStoredData(
            data,
            function () {
            },
            function () {
                toastr.error('Could not load data to export.');
            }
        ).then(function(data){
            vm.storedData = data.snaps;
            return vm.storedData;
        });
    }

    ////////// Data settings

    ////////// View settings

    ////////// Watchers on the wall

    ////////// Local storage / cookies

  }

})();
