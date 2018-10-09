angular.module 'trPcApp'
  .directive 'newsFeedList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/newsFeedList.html'
    restrict: 'E'
    replace: true
    scope:
      items: '='
  ]