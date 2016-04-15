(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .config(config);

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    addState();
    addAsDefaultState();

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

    function addAsDefaultState() {
      $urlRouterProvider.otherwise('dashboard');
    }

  }

})();
