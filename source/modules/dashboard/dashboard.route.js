(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .config(config);

  /* @ngInject */
  function config($stateProvider) {

    addState();

    ///////////

    function addState() {
      $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/dashboard/dashboard.html',
        controller: 'dashboard as vm',
        ncyBreadcrumb: {
          label: 'Dashboard'
        }
      });
    }

  }

})();
