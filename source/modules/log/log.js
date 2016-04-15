(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log($http, $scope, $cookies, $interval, $window, toastr, devicesService) {

    var vm = this;

    vm.snap = snap;
    vm.reset = reset;

    vm.availableCameras = [];
    vm.availableLenses = [];
    vm.availableApertures = [];

    vm.getAvailableLenses = availableLenses;
    vm.getAvailableApertures = availableApertures;

    setInitValues();

    ////////////////

    function setInitValues (clearValues) {

        vm.selectedCamera = $cookies.get('storedCamera') || '';
        vm.selectedLens = $cookies.get('storedLens') || '';
        vm.selectedFilePattern = $cookies.get('storedFilePattern') || 'DSC#####';
        if (!clearValues) {

            vm.selectedSeriesName = $cookies.get('storedSeriesName') || '';
            vm.selectedFileNumber = parseInt($cookies.get('storedFileNumber')) || '';
            vm.selectedLocation = $cookies.get('storedLocation') || '';
            vm.selectedFocalLength = parseInt($cookies.get('storedFocalLength')) || '';
            vm.selectedFocalDistance = parseFloat($cookies.get('storedFocalDistance')) || '';
            vm.selectedAperture = parseFloat($cookies.get('storedAperture')) || '';
            vm.NumberOfSaved = parseInt($cookies.get('storedNumberOfSaved')) || 0;
            getLocation();

        } else {

            vm.selectedSeriesName = '';
            vm.selectedFileNumber = '';
            vm.selectedLocation = '';
            vm.selectedFocalLength = '';
            vm.selectedFocalDistance = '';
            vm.selectedAperture = '';
            vm.NumberOfSaved = 0;
            getLocation();

        }

        vm.cameraOpen = isCameraOpen();
        vm.seriesOpen = isSeriesOpen();
        vm.settingsOpen = isSettingsOpen();

        vm.availableCameras = availableCameras();
        vm.availableLenses = availableLenses();
        vm.availableApertures = availableApertures();

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
        toastr.info('New series initialized, please recheck the settings.');
        setInitValues(true);
    }

    function removeLocalData () {
        $window.localStorage.removeItem('stagedSnaps');
        toastr.info('Offline data purged.');
    }

    // For the sake of validation and ordering, aperture size is reversed in these functions. e.g. 16 is considered large and 1.8 is considered small. Just for ordering sizes.
    function minAperture() {
        if (vm.selectedLens && vm.availableApertures) {
            // return min aperture for selected lens (property maxAperture!)
            var obj = _.find(vm.availableLenses, function(o) { return (o.lens_id == vm.selectedLens) });
            return obj.min_aperture;
        } else if (angular.isArray(vm.availableApertures)) {
            return Math.min.apply(Math,vm.availableApertures.map(function(o){return o.value;}))
        }
    }

    function maxAperture() {
        if (vm.selectedLens && vm.availableApertures) {
            // return max aperture for selected lens (property maxAperture!)
            var obj = _.find(vm.availableLenses, function(o) { return (o.lens_id == vm.selectedLens) });
            return obj.max_aperture;
        } else if (angular.isArray(vm.availableApertures)) {
            return Math.max.apply(Math,vm.availableApertures.map(function(o){return o.value;}))
        }
    }

    //////////////////// Private functions

    ////////// Data sources

    function availableCameras () {
       return devicesService.getCameras().then(function(cameras) {
            vm.availableCameras = cameras;
            return vm.availableCameras;
        });
    }

    function availableLenses () {
       return devicesService.getLenses(vm.selectedCamera).then(function(lenses) {
            vm.availableLenses = lenses;
            return vm.availableLenses;
        });
    }

    function availableApertures () {
       return devicesService.getApertures(vm.selectedLens).then(function(apertures) {
            vm.availableApertures = apertures;
            return vm.availableApertures;
        });
    }

    function getLocation() {
        //var manualLocation = false;
        if (navigator.geolocation) {

            var locSuccess = function (position) {

                // Get default from API
                var coords = position.coords;
                vm.selectedLocationLat = coords.latitude;
                vm.selectedLocationLong = coords.longitude;

                vm.map = {
                    center: {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    },
                    zoom: 8,
                    options: {
                        scrollwheel: false
                    }
                };

                vm.marker = {
                    id: 0,
                    coords: {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    },
                    options: { draggable: true },
                    events: {
                        dragend: function (marker, eventName, args) {
                            vm.selectedLocationLat = marker.getPosition().lat();
                            vm.selectedLocationLong = marker.getPosition().lng();
                        }
                    }
                };
            }

            var locError = function (error) {
                toastr.error('Unable to resolve geolocation: ('+ error.code +') '+ error.message);
            }

            navigator.geolocation.getCurrentPosition(locSuccess);

            var locOptions = {
                enableHighAccuracy: true,
                maximumAge        : 30000,
                timeout           : 27000
            };

            var wpid = navigator.geolocation.watchPosition(locSuccess, locError, locOptions);

        } else {
            toastr.warning('No geolocation available.');
        }
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
            padding = vm.selectedFilePattern.replace(prefix,'').length,
            now = new Date();

        fileName = prefix + ('0000000000' + vm.selectedFileNumber).slice(-padding);

        var url = '../server/snapSave.phpError',
            data = {
                "cameraId" : vm.selectedCamera,
                "lensId" : vm.selectedLens,
                "fileName" : fileName,
                "seriesName" : vm.selectedSeriesName,
                "focalLength" : vm.selectedFocalLength,
                "focalDistance" : vm.selectedFocalDistance,
                "apertureSize" : vm.selectedAperture,
                "fileDate" : now.toISOString(),
                "locationLat" : vm.selectedLocationLat,
                "locationLong" : vm.selectedLocationLong
            };

        $http({
            method: 'POST',
            url: url,
            data: data
            }).then(function successCallback() {

                toastr.success('File '+ fileName +' saved.');
                snapUpdate();

            }, function errorCallback() {
                toastr.error('File '+ fileName +' not saved. Stored on device.');
                snapSaveOffline(data);
            });

    }

    function snapUpdate () {

        vm.selectedFileNumber = parseInt(vm.selectedFileNumber + 1);
        vm.NumberOfSaved += 1;

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

    ////////// Data settings

    function snapSaveOffline (data) {

        var a = [];
        if ($window.localStorage.getItem('stagedSnaps') !== null) a = angular.fromJson($window.localStorage.getItem('stagedSnaps'));
        a.push(data);
        $window.localStorage.setItem('stagedSnaps', angular.toJson(a));
        snapUpdate();

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

    ////////// Watchers on the wall

    $scope.$watch('vm.selectedLens', function() {
        // update the DOM with newValue instead of oldValue
        vm.minAperture = minAperture();
        vm.maxAperture = maxAperture();
    });

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
        $cookies.put('storedLocationLat', vm.selectedLocationLat);
        $cookies.put('storedLocationLong', vm.selectedLocationLong);

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

  }

})();
