(function () {

    'use strict';

    angular
        .module('app.core')
        .factory('devicesService', devicesService);

    /* @ngInject */
    function devicesService() {

        var service = {
            getCameras: getCameras,
            getLenses: getLenses,
            getApertures: getApertures
        }

        return service;

        ////////////////

        function getCameras() {
            return [
                { "value": "ILCE-6000", "text": "Sony a6000" },
                { "value": "iPhone5S", "text": "iPhone 5S" }
            ];
        }

        function getLenses() {
            return [
                { "value": "SEL-1650", "text": "Sony E 16-50mm f/3.5-5.6 OSS PZ", "maxAperture" : 3.5, "minAperture": 22, "compatibleCameras" : ["ILCE-6000"] },
                { "value": "SY-12", "text": "Samyang 12 mm f/2.0 NCS CS", "maxAperture" : 2, "minAperture": 22, "compatibleCameras" : ["ILCE-6000"] },
                { "value": "SA-19", "text" : "Sigma 19mm f/2.8 DN ART", "maxAperture" : 2.8, "minAperture": 22, "compatibleCameras" : ["ILCE-6000"] },
                { "value": "SA-30", "text" : "Sigma 30mm f/2.8 DN ART", "maxAperture" : 2.8, "minAperture": 22, "compatibleCameras" : ["ILCE-6000"] },
                { "value": "NIKKOR", "text" : "NIKKOR 18-55", "maxAperture" : 3.5, "minAperture": 16, "compatibleCameras" : ["iPhone5S"] }
            ];
        }

        function getApertures() {
            return [
                { "value" : 1, "text" : "f/1"},
                { "value" : 1.4, "text" : "f/1.4"},
                { "value" : 1.8, "text" : "f/1.8"},
                { "value" : 2, "text" : "f/2"},
                { "value" : 2.8, "text" : "f2.81"},
                { "value" : 4, "text" : "f/4"},
                { "value" : 5.6, "text" : "f/5.6"},
                { "value" : 8, "text" : "f/8"},
                { "value" : 11, "text" : "f/11"},
                { "value" : 16, "text" : "f/16"},
                { "value" : 22, "text" : "f/22"}
            ];
        }
    }

})();

