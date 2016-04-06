(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log($http, $cookies, toastr, devicesService) {

    var vm = this;

    vm.snap = snap;
    vm.reset = reset;

    setInitValues();

    ////////////////

    function setInitValues (clearValues) {

        vm.selectedCamera = $cookies.get('storedCamera') || 'ILCE-6000';
        vm.selectedLens = $cookies.get('storedLens') || 'Samyang 12mm f/2.0 NCS CS Sony';
        vm.selectedFilePattern = $cookies.get('storedFilePattern') || 'DSC_#####';
        if (!clearValues) {

            vm.selectedSeriesName = $cookies.get('storedSeriesName') || '';
            vm.selectedFileNumber = parseInt($cookies.get('storedFileNumber')) || '';
            vm.selectedLocation = $cookies.get('storedLocation') || '';
            vm.selectedFocalLength = parseInt($cookies.get('storedFocalLength')) || '';
            vm.selectedFocalDistance = parseFloat($cookies.get('storedFocalDistance')) || '';
            vm.selectedAperture = parseFloat($cookies.get('storedAperture')) || '';
            vm.NumberOfSaved = parseInt($cookies.get('storedNumberOfSaved')) || 0;

        } else {

            vm.selectedSeriesName = '';
            vm.selectedFileNumber = '';
            vm.selectedLocation = '';
            vm.selectedFocalLength = '';
            vm.selectedFocalDistance = '';
            vm.selectedAperture = '';
            vm.NumberOfSaved = 0;

        }

        vm.cameraOpen = isCameraOpen();
        vm.seriesOpen = isSeriesOpen();
        vm.settingsOpen = isSettingsOpen();

        vm.availableCameras = availableCameras();
        vm.availableLenses = availableLenses();
        vm.availableApertures = availableApertures();

        vm.minAperture = minAperture();
        vm.maxAperture = maxAperture();
        vm.apertureInRange = apertureInRange();

    }

    //////////////////// Public

    function snap () {
        toastr.info('Saving a snap from '+ vm.selectedCamera +' to series '+ vm.selectedSeriesName +'.');

        if (fieldsAreValid()){
            snapSave();
        } else {
            toastr.warning('Not all require fields met.');
        }
    }

    function reset () {
        toastr.info('New series initialized, please recheck the values.');
        setInitValues(true);
    }

    // For the sake of validation and ordering, aperture size is reversed in these functions. e.g. 16 is considered large and 1.8 is considered small. Just for ordering sizes.
    function minAperture() {
        if (vm.selectedLens) {
            // return min aperture for selected lens (property maxAperture!)
            var obj = _.find(availableLenses(), function(o) { return (o.value == vm.selectedLens) });
            return obj.maxAperture;
        } else {
            return Math.min.apply(Math,availableApertures().map(function(o){return o.value;}))
        }
    }

    function maxAperture() {
        if (vm.selectedLens) {
            // return max aperture for selected lens (property maxAperture!)
            var obj = _.find(availableLenses(), function(o) { return (o.value == vm.selectedLens) });
            return obj.minAperture;

        } else {
            return Math.max.apply(Math,availableApertures().map(function(o){return o.value;}))
        }
    }

    function apertureInRange() {
        return true;
    }

    //////////////////// Private functions

    ////////// Data sources

    function availableCameras () {
        return devicesService.getCameras();
    }

    function availableLenses () {
        return devicesService.getLenses();
    }

    function availableApertures () {
        return devicesService.getApertures();
    }

    ////////// Form actions

    function fieldsAreValid () {
        // if fails, return false;
        return true;
    }

    function snapSave () {

        setCookie();

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

    function snapUpdate () {

        vm.selectedFileNumber = parseInt(vm.selectedFileNumber + 1);
        vm.NumberOfSaved += 1;

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

    ////////// View settings

    function isCameraOpen () {

        if ( (vm.selectedCamera === '') || (vm.selectedLens === '') || (vm.selectedFilePattern === '') ) {
            return true;
        } else {
            return false;
        }

    }

    function isSeriesOpen () {

        if ( (!vm.cameraOpen) && ( (vm.selectedSeriesName === '') || (vm.selectedFileNumber === '') ) ) {
            return true;
        } else {
            return false;
        }

    }

    function isSettingsOpen () {

        if (!vm.cameraOpen && !vm.seriesOpen) {
            return true;
        } else {
            return false;
        }
    }

    ////////// Local storage

    function setCookie () {

        $cookies.put('storedCamera', vm.selectedCamera);
        $cookies.put('storedLens', vm.selectedLens);
        $cookies.put('storedFilePattern', vm.selectedFilePattern);
        $cookies.put('storedSeriesName', vm.selectedSeriesName);
        $cookies.put('storedFileNumber', vm.selectedFileNumber);
        $cookies.put('storedLocation', vm.selectedLocation);
        $cookies.put('storedFocalLength', vm.selectedFocalLength);
        $cookies.put('storedFocalDistance', vm.selectedFocalDistance);
        $cookies.put('storedAperture', vm.selectedAperture);

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

  }

})();
