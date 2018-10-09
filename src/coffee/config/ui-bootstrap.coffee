angular.module 'trPcApp'
  .config [
    '$uibModalProvider'
    ($uibModalProvider) ->
      angular.extend $uibModalProvider.options, 
        windowClass: 'ng-pc-modal'
  ]