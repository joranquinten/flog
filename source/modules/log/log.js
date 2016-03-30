(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log(toastr, logService, $http) {

    var vm = this;
    // vars

    // functions
    vm.availableCameras = availableCameras();
    vm.availableLenses = availableLenses();
    vm.availableApertures = availableApertures();

    vm.snap = snap;
    vm.reset = reset;

    setInitValues();

    ////////////////

    function setInitValues(){

        vm.selectedCamera = 'ILCE-6000';
        vm.selectedLens = 'Samyang 12mm f/2.0 NCS CS Sony';
        vm.selectedFilePattern = 'DSC_#####';
        vm.selectedSeriesName = '';
        vm.selectedFileNumber = '';
        vm.selectedLocation = '';
        vm.selectedFocalLength = '';
        vm.selectedFocalDistance = '';
        vm.selectedAperture = '';

        vm.seriesOpen = true;
        vm.NumberOfSaved = 0;

    }

    function snap(){
        toastr.info('Saving a snap from '+ vm.selectedCamera +' to series '+ vm.selectedSeriesName +'.');

        console.log(vm);

        if (fieldsAreValid()){
            snapSave();
        } else {
            toastr.warning('Not all require fields met.');
        }
    }

    function reset(){
        toastr.info('New series initialized, please recheck the values.');
        setInitValues();
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

    // internal functions
    function fieldsAreValid(){
        // if fails, return false;
        return true;
    }

    function snapSave(){

        var fileName,
            prefix = vm.selectedFilePattern.split('#')[0],
            padding = vm.selectedFilePattern.replace(prefix,'').length;

        fileName = prefix + ('0000000000' + vm.selectedFileNumber).slice(-padding);

        var url = '../server/snapSave.php',
            data = {
                "cameraName" : vm.selectedCamera,
                "lensName" : vm.selectedLens,
                "fileName" : fileName,
                "seriesName" : vm.selectedSeriesName,
                "focalLength" : vm.selectedFocalLength,
                "focalDistance" : vm.selectedFocalDistance,
                "apertureSize" : vm.selectedAperture,
                "fileDate" : null,
                "location" : vm.selectedLocation
            };

        $http({
            method: 'POST',
            url: url,
            data: data
            }).then(function successCallback(response) {

                toastr.success('File '+ fileName +' saved.');
                snapUpdate();

            }, function errorCallback(response) {
                toastr.error('File '+ fileName +' not saved. Use offline storage?');
            });


    }

    function snapUpdate(){

        vm.selectedFileNumber = parseInt(vm.selectedFileNumber + 1);
        vm.NumberOfSaved += 1;

        console.log('Updating...')
    }

  }

})();
