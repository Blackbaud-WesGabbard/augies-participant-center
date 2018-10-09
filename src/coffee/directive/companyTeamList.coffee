angular.module 'trPcApp'
  .directive 'companyTeamList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/companyTeamList.html'
    restrict: 'E'
    replace: true
    scope:
      teams: '='
  ]