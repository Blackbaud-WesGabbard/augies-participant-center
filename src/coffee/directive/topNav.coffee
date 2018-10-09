angular.module 'trPcApp'
  .directive 'topNav', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/topNav.html'
    restrict: 'E'
    replace: true
  ]