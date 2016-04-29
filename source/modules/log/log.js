(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log($http, $scope, $cookies, $interval, $window, toastr, dataService) {

    var apertures = '2.0,2.8,4.0,5.6,8,11,16,22'.split(',');

    var vm = this;

    vm.snap = snap;
    vm.reset = reset;
    vm.getLocation = getLocation;
    vm.removeLocation = removeLocation;
    vm.itemsInLocalStorage = itemsInLocalStorage();

    vm.selectedAperture = {
            value: 5.6,
            options: {
                stepsArray: apertures
                }
            };

    vm.selectedFocalDistance = {
            value: null,
            options: {
                floor: 0.2,
                ceil: 1.5,
                step: 0.1,
                precision: 1
                }
            };

    setInitValues();

    ////////////////

    function setInitValues (clearValues) {

        vm.selectedFilePattern = $cookies.get('storedFilePattern') || 'DSC#####';
        if (!clearValues) {

            vm.selectedSeriesName = $cookies.get('storedSeriesName') || '';
            vm.selectedFileNumber = parseInt($cookies.get('storedFileNumber')) || '';
            vm.selectedLocation = $cookies.get('storedLocation') || '';

            vm.selectedAperture.value = apertures.indexOf($cookies.get('storedAperture'));
            vm.selectedFocalDistance.value = parseFloat($cookies.get('storedFocalDistance') || 0.2);

            vm.snapNotes = $cookies.get('storedSnapNotes') || '';
            vm.NumberOfSaved = parseInt($cookies.get('storedNumberOfSaved')) || 0;
            //getLocation();

        } else {

            vm.selectedFileNumber = '';
            vm.selectedLocation = '';
            vm.selectedFocalDistance.value = 0;
            vm.selectedAperture.value = 0;
            vm.snapNotes = '';
            vm.NumberOfSaved = 0;
            //getLocation();

        }

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

    function removeLocation() {
        vm.selectedLocationLat = null;
        vm.selectedLocationLong = null;
        vm.accuracy = null;

    }

    //////////////////// Private functions

    ////////// Data sources

    ////////// Form actions

    function fieldsAreValid () {
        // if fails, return false;
        return $scope.logForm.$valid;
    }

    function snapSave () {

        setCookie();

        var fileName,
            prefix = vm.selectedFilePattern.split('#')[0],
            padding = vm.selectedFilePattern.replace(prefix,'').length,
            now = new Date();

            fileName = prefix + ('0000000000' + vm.selectedFileNumber).slice(-padding);

        var data = {
                "fileName" : fileName || null,
                "focalDistance" : vm.selectedFocalDistance.value || null,
                "apertureSize" : vm.selectedAperture.value || null,
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

                vm.itemsInLocalStorage += 1;
                snapSaveOffline(data);
            }
        );

    }

    function snapUpdate () {

        vm.selectedFileNumber += 1;
        vm.NumberOfSaved += 1;

        $cookies.put('storedFileNumber', vm.selectedFileNumber);
        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

    ////////// Data settings

    function snapSaveOffline (data) {
        dataService.addToLocalData('stagedSnaps', data);
        snapUpdate();

    }

    ////////// Watchers on the wall

    function itemsInLocalStorage() {
        if (angular.isDefined(dataService.getFromLocalData('stagedSnaps'))) {
            var items = dataService.getFromLocalData('stagedSnaps');
            return items.length;
        }
    }

    ////////// Local storage

    function setCookie () {

        $cookies.put('storedFilePattern', vm.selectedFilePattern);
        $cookies.put('storedFileNumber', vm.selectedFileNumber);
        $cookies.put('storedLocation', vm.selectedLocation);
        $cookies.put('storedFocalDistance', vm.selectedFocalDistance.value);
        $cookies.put('storedAperture', apertures[vm.selectedAperture.value]);
        $cookies.put('storedSnapNotes', vm.snapNotes);
        $cookies.put('storedLocationLat', vm.selectedLocationLat);
        $cookies.put('storedLocationLong', vm.selectedLocationLong);

        $cookies.put('storedNumberOfSaved', vm.NumberOfSaved);

    }

  }

})();
