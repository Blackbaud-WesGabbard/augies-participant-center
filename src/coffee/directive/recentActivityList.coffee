angular.module 'trPcApp'
  .directive 'recentActivityList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/recentActivityList.html'
    restrict: 'E'
    replace: true
    scope:
      records: '='
  ]