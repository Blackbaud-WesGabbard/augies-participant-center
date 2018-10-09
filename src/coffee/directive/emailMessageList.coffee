angular.module 'trPcApp'
  .directive 'emailMessageList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/emailMessageList.html'
    restrict: 'E'
    replace: true
    scope:
      messages: '='
      selectMessage: '='
      deleteMessage: '='
  ]