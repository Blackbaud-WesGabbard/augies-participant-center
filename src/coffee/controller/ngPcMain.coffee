angular.module 'trPcControllers'
  .controller 'NgPcMainCtrl', [
    '$rootScope'
    '$location'
    'LocaleService'
    ($rootScope, $location, LocaleService) ->
      $rootScope.$location = $location
      
      $rootScope.baseUrl = $location.absUrl().split('#')[0]
      
      LocaleService.setLocale $rootScope.locale
      
      $rootScope.changeLocale = ->
        LocaleService.setLocale()
  ]