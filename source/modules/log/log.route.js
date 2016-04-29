(function() {

  'use strict';

  angular
    .module('app.log')
    .config(config);

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    addState();
    addAsDefaultState();

    ///////////

    function addState() {
      $stateProvider.state('log', {
        url: '/log',
        templateUrl: 'modules/log/log.html',
        controller: 'log as vm',
        ncyBreadcrumb: {
          label: 'Log'/*,
          parent: 'dashboard'*/
        }
      });
    }

    function addAsDefaultState() {
      $urlRouterProvider.otherwise('log');
    }

  }

})();
