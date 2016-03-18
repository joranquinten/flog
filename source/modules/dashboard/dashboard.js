(function() {

  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashboard', dashboard);

  /* @ngInject */
  function dashboard(toastr) {

    var vm = this;
    // vars

    // functions
    vm.success = success;
    vm.warning = warning;
    vm.info = info;
    vm.error = error;

    ////////////////

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
