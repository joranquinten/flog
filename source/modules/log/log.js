(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log(toastr, logService) {

    var vm = this;
    // vars
    vm.selectedCamera = 'ILCE-6000';
    vm.selectedLens = 'Samyang 12mm f/2.0 NCS CS Sony';
    vm.selectedFilePattern = 'DSC_#####';
    vm.selectedSeriesName = '';
    vm.selectedFileNumber = '';
    vm.selectedLocation = '';
    vm.selectedFocalLength = '';
    vm.selectedFocalDisctance = '';
    vm.selectedAperture = '';

    // functions
    vm.availableCameras = availableCameras();
    vm.availableLenses = availableLenses();
    vm.availableApertures = availableApertures();

    vm.snap = snap;

    vm.success = success;
    vm.warning = warning;
    vm.info = info;
    vm.error = error;

    ////////////////

    function snap(){
        toastr.info('Saving a snap from '+ vm.selectedCamera);

        console.log(vm);
// Getting
/*
vm.selectedCamera
vm.selectedLens
vm.selectedFilePattern
vm.selectedSeriesName
vm.selectedFileNumber
vm.selectedLocation
vm.selectedFocalLength
vm.selectedFocalDisctance
vm.selectedAperture
*/
    }

    function availableCameras(){
        return logService.getCameras();
    }

    function availableLenses(){
        return logService.getLenses();
    }

    function availableApertures(){
        return logService.getApertures();
    }

    function success() {
      toastr.success('success')
    }

    function warning() {
      toastr.warning('warning')
    }

    function info() {
      toastr.info('info')
    }

    function error() {
      toastr.error('error')
    }

  }

})();
