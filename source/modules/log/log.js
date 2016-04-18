(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log($http, $scope, $cookies, $interval, $window, toastr, devicesService, dataService) {

    var vm = this;

    vm.snap = snap;
    vm.reset = reset;
    vm.getLocation = getLocation;

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
            vm.snapNotes = $cookies.get('storedSnapNotes') || '';
            vm.NumberOfSaved = parseInt($cookies.get('storedNumberOfSaved')) || 0;
            //getLocation();

        } else {

            vm.selectedSeriesName = '';
            vm.selectedFileNumber = '';
            vm.selectedLocation = '';
            vm.selectedFocalLength = '';
            vm.selectedFocalDistance = '';
            vm.selectedAperture = '';
            vm.snapNotes = '';
            vm.NumberOfSaved = 0;
            //getLocation();

        }

        vm.availableCameras = availableCameras();
        vm.availableLenses = availableLenses();
        vm.availableApertures = availableApertures();

    }

    //////////////////// Public

    function snap () {
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


    function getLocation() {
        if (navigator.geolocation) {

            var locSuccess = function (position) {

                // Get default from API
                var coords = position.coords;
                vm.selectedLocationLat = coords.latitude.toFixed(7);
                vm.selectedLocationLong = coords.longitude.toFixed(7);
                vm.accuracy = coords.accuracy;

                vm.map = {
                    center: {
                        latitude: coords.latitude.toFixed(7),
                        longitude: coords.longitude.toFixed(7)
                    },
                    zoom: 8,
                    options: { scrollwheel: false }
                };

                vm.marker = {
                    id: 0,
                    coords: {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    },
                    options: { draggable: true },
                    events: {
                        dragend: function (marker) {
                            vm.selectedLocationLat = marker.getPosition().lat().toFixed(7);
                            vm.selectedLocationLong = marker.getPosition().lng().toFixed(7);
                        }
                    }
                };

                $scope.$apply();
            }

            var locError = function (error) {
                toastr.error('Unable to resolve geolocation: '+ error.message);
            }


            var locOptions = {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 5000
            };

            navigator.geolocation.getCurrentPosition(locSuccess, locError, locOptions);

            //var wpid = navigator.geolocation.watchPosition(locSuccess, locError, locOptions);

        } else {
            toastr.warning('No geolocation available.');
        }
    }

    // For the sake of validation and ordering, aperture size is reversed in these functions. e.g. 16 is considered large and 1.8 is considered small. Just for ordering sizes.
    function minAperture() {
        if (vm.selectedLens && vm.availableApertures) {
            // return min aperture for selected lens (property maxAperture!)
            var obj = _.find(availableLenses, function(o) { return (o.lens_id == vm.selectedLens) });
            return (angular.isDefined(obj)) ? obj.min_aperture : false;
        } else if (angular.isArray(vm.availableApertures)) {
            return Math.min.apply(Math,vm.availableApertures.map(function(o){return o.value;}))
        }
    }

    function maxAperture() {
        if (vm.selectedLens && vm.availableApertures) {
            // return max aperture for selected lens (property maxAperture!)
            var obj = _.find(availableLenses, function(o) { return (o.lens_id == vm.selectedLens) });
            return (angular.isDefined(obj)) ? obj.max_aperture : false;
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

    ////////// Form actions

    function fieldsAreValid () {
        // if fails, return false;

         console.log($scope.logForm.$valid)

        return false;
    }

    function snapSave () {

        setCookie();

        var fileName,
            prefix = vm.selectedFilePattern.split('#')[0],
            padding = vm.selectedFilePattern.replace(prefix,'').length,
            now = new Date();

            fileName = prefix + ('0000000000' + vm.selectedFileNumber).slice(-padding);

        var data = {
                "cameraId" : vm.selectedCamera || null,
                "lensId" : vm.selectedLens || null,
                "fileName" : fileName || null,
                "seriesName" : vm.selectedSeriesName || null,
                "focalLength" : vm.selectedFocalLength || null,
                "focalDistance" : vm.selectedFocalDistance || null,
                "apertureSize" : vm.selectedAperture || null,
                "fileDate" : now.toISOString() || null,
                "locationLat" : vm.selectedLocationLat || null,
                "locationLong" : vm.selectedLocationLong || null,
                "snapNotes" : vm.snapNotes || null
            };

        dataService.saveSnap(
            data,
            function() {
                toastr.success('File '+ fileName +' saved.');
                snapUpdate();
            },
            function () {
                toastr.error('File '+ fileName +' not saved. Stored on device.');
                snapSaveOffline(data);
            }
        );

    }

    function snapUpdate () {

        vm.selectedFileNumber = parseInt(vm.selectedFileNumber + 1);
        vm.NumberOfSaved += 1;

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

    ////////// Data settings

    function snapSaveOffline (data) {

        addToLocalData('stagedSnaps', data);
        snapUpdate();

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
        $cookies.put('storedSnapNotes', vm.snapNotes);
        $cookies.put('storedLocationLat', vm.selectedLocationLat);
        $cookies.put('storedLocationLong', vm.selectedLocationLong);

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

  }

})();
