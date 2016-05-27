(function() {

  'use strict';

  angular
    .module('app.exportData')
    .controller('exportData', storedData);

  /* @ngInject */
  function storedData(toastr, dataService) {

    var vm = this;
    var selectedIds = [];

    vm.exportStoredData = exportStoredData;
    vm.exportSelectedStoredData = exportSelectedStoredData;
    vm.deleteSelectedStoredData = deleteSelectedStoredData;

    vm.storedData = storedData();
    vm.toggleSelection = toggleSelection;

    ////////////////


    //////////////////// Public

    function exportStoredData () {
        dataService.exportFromStoredData();
    }

    function exportSelectedStoredData () {
        dataService.exportFromStoredData({ids: selectedIds});
    }

    function deleteSelectedStoredData () {
        dataService.deleteFromStoredData({ids: selectedIds}).then(function(){
            vm.storedData = storedData();
        });
    }

    function toggleSelection(snapId) {
        var idx = selectedIds.indexOf(snapId);

        if (idx > -1) {
          selectedIds.splice(idx, 1);
        } else {
          selectedIds.push(snapId);
        }

        vm.selection = selectedIds;
        return vm.selection;
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
