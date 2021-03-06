(function() {

  'use strict';

  angular
    .module('app.core')
    .value('coreConfig', {
      appTitle: 'HTML5 Boilerplate'
    })
    .config(setConfiguration);


  /* @ngInject */
  function setConfiguration(toastrConfig) {

    setToastrConfig();

    ////////////////

    function setToastrConfig() {
      angular.extend(toastrConfig, {
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true,
        tapToDismiss: true
      });
    }

  }

})();
