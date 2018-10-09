angular.module 'trPcApp'
  .factory 'LocaleService', [
    '$rootScope'
    '$translate'
    'LuminateRESTService'
    ($rootScope, $translate, LuminateRESTService) ->
      listSupportedLocales: ->
        LuminateRESTService.contentRequest 'method=listSupportedLocales', true, true
          .then (response) ->
            response
      
      setLocale: (locale) ->
        $rootScope.locale = locale
        $translate.use locale
  ]