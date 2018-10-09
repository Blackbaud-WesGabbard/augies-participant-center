angular.module 'trPcApp'
  .directive 'badgeList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/badgeList.html'
    restrict: 'E'
    replace: true
    scope:
      badges: '='
  ]