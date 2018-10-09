angular.module 'trPcApp'
  .directive 'teamMemberList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/teamMemberList.html'
    restrict: 'E'
    replace: true
    scope:
      members: '='
  ]