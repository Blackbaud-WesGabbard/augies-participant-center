angular.module 'trPcApp'
  .directive 'importContactsList', [
    'APP_INFO'
    (APP_INFO) ->
      templateUrl: APP_INFO.rootPath + 'html/directive/importContactsList.html'
      restrict: 'E'
      replace: true
      scope:
        contacts: '='
        toggleContact: '='
  ]