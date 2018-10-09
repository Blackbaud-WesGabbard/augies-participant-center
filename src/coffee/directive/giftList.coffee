angular.module 'trPcApp'
  .directive 'giftList', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/giftList.html'
    restrict: 'E'
    replace: true
    scope:
      gifts: '='
      showActions: '='
      acknowledgeGift: '&'
      thankDonor: '&'
      deleteGift: '&'
      giftActionLabels: '='
  ]