angular.module 'trPcApp'
  .directive 'contactList', [
    'APP_INFO'
    (APP_INFO) ->
      templateUrl: APP_INFO.rootPath + 'html/directive/contactList.html'
      restrict: 'E'
      replace: true
      scope:
        contacts: '='
        toggleContact: '='
        selectContact: '='
        deleteContact: '='
  ]