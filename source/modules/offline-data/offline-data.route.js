(function() {

  'use strict';

  angular
    .module('app.offlineData')
    .config(config);

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    addState();

    ///////////

    function addState() {
      $stateProvider.state('offlinedata', {
        url: '/offline-data',
        templateUrl: 'modules/offline-data/offline-data.html',
        controller: 'offlineData as vm',
        ncyBreadcrumb: {
          label: 'Offline data'
        }
      });
    }

  }

})();
