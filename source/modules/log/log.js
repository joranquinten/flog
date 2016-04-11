(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log($http, $scope, $cookies, $interval, toastr, devicesService, GoogleMapsInitializer) {

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

    // For the sake of validation and ordering, aperture size is reversed in these functions. e.g. 16 is considered large and 1.8 is considered small. Just for ordering sizes.
    function minAperture() {
        if (vm.selectedLens) {
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
        var manualLocation = false;
        if (navigator.geolocation && !manualLocation) {

            var locSuccess = function (position) {


                $scope.$apply(function() {

                    if (!manualLocation) {
                        vm.selectedLocationLat = position.coords.latitude;
                        vm.selectedLocationLong = position.coords.longitude;
                    }

                    GoogleMapsInitializer.mapsInitialized.then(function(){

                        var mapOptions = {
                            zoom: 15,
                            center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        angular.element(document).ready(function () {

                            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
                            var marker = new google.maps.Marker({
                                position: { lat: position.coords.latitude, lng: position.coords.longitude },
                                map: map,
                                draggable: true,
                                title: 'This is you!'
                            });

                            google.maps.event.addListener(marker, 'dragend', function(e){

                                manualLocation = true;

                                vm.selectedLocationLat = e.latLng.lat().toFixed(7);
                                vm.selectedLocationLong = e.latLng.lng().toFixed(7);

                                setMapToCenter();

                                $scope.$apply();

                                console.log('Check out https://angular-ui.github.io/angular-google-maps/#!/ or https://ngmap.github.io/');

                            });

                            function setMapToCenter(){
                                if (map) {
                                    var center = map.getCenter();
                                    google.maps.event.trigger(map, "resize");
                                    map.setCenter(center);
                                }
                            }

                        });


                    });

                });
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
            padding = vm.selectedFilePattern.replace(prefix,'').length;

        fileName = prefix + ('0000000000' + vm.selectedFileNumber).slice(-padding);

        var url = '../server/snapSave.php',
            data = {
                "cameraId" : vm.selectedCamera,
                "lensId" : vm.selectedLens,
                "fileName" : fileName,
                "seriesName" : vm.selectedSeriesName,
                "focalLength" : vm.selectedFocalLength,
                "focalDistance" : vm.selectedFocalDistance,
                "apertureSize" : vm.selectedAperture,
                "fileDate" : null,
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
