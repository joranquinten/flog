(function() {

  'use strict';

  angular
    .module('app.log')
    .controller('log', log);

  /* @ngInject */
  function log(toastr, logService) {

    var vm = this;
    // vars

    // functions
    vm.availableLenses = availableLenses();
    vm.success = success;
    vm.warning = warning;
    vm.info = info;
    vm.error = error;

    ////////////////

    function availableLenses(){
        return logService.getLenses();
    }

    function success() {
      toastr.success('success')
    }

    function warning() {
      toastr.warning('warning')
    }

    function info() {
      toastr.info('info')
    }

    function error() {
      toastr.error('error')
    }

  }

})();
