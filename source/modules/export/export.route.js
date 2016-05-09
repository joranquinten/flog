(function() {

  'use strict';

  angular
    .module('app.exportData')
    .config(config);

  /* @ngInject */
  function config($stateProvider) {

    addState();

    ///////////

    function addState() {
      $stateProvider.state('export-data', {
        url: '/export-data',
        templateUrl: 'modules/export/export.html',
        controller: 'exportData as vm',
        ncyBreadcrumb: {
          label: 'Export data'
        }
      });
    }

  }

})();
