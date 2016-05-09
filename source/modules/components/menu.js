(function() {

  'use strict';

  angular
    .module('app.menu')
    .directive('menu', menu)
    .controller('menuController', menuController);

  /* @ngInject */
  function menu() {

      var directive = {
        restrict: 'E',
        replace: true,
        transclude : true,
        scope: {},
        controller: 'menuController as vm',
        templateUrl: 'modules/components/menu.html'

      }

      return directive;

  }

  function menuController($state) {

    var vm = this;

    vm.toggleOverlay = toggleOverlay;

    vm.state = $state;

    ////////////////

    //////////////////// Public

    function toggleOverlay() {

        vm.overlayIsOpen = !vm.overlayIsOpen;

        if (vm.overlayIsOpen) {
            vm.overlayClassName = 'open';
        } else {
            vm.overlayClassName = 'close';
        }
        return vm.overlayClassName;
    }

    //////////////////// Private functions

    ////////// Data sources

    ////////// Data settings

    ////////// View settings

    ////////// Watchers on the wall

    ////////// Local storage / cookies

  }

})();
