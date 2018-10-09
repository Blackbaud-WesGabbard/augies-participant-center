angular.module 'trPcApp'
  .directive 'teamsList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/teamsList.html'
    restrict: 'E'
    transclude: true
    replace: true
    scope:
      teams: '='
      joinTeam: '&'
  ]