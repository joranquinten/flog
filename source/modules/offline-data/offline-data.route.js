(function() {

  'use strict';

  angular
    .module('app.offlineData')
    .config(config);

  /* @ngInject */
  function config($stateProvider) {

    addState();

    ///////////

    function addState() {
      $stateProvider.state('offline-data', {
        url: '/offline-data',
        templateUrl: 'modules/offline-data/offline-data.html',
        controller: 'offlineData as vm',
        ncyBreadcrumb: {
          label: 'Offline data',
          parent: 'log'
        }
      });
    }

  }

})();
