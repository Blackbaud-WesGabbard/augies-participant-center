angular.module 'trPcApp', [
  'ngRoute'
  'ngSanitize'
  'ngCookies'
  'ui.bootstrap'
  'cgBusy'
  'pascalprecht.translate'
  'textAngular'
  'formly'
  'formlyBootstrap'
  'trPcControllers'
]

angular.module 'trPcControllers', []

angular.module 'trPcApp'
  .constant 'APP_INFO', 
    version: '1.0'
    rootPath: '../angular-teamraiser-participant-center/dist/'

angular.module 'trPcApp'
  .run [
    '$rootScope'
    '$window'
    'APP_INFO'
    ($rootScope, $window, APP_INFO) ->
      $rootScope.Math = $window.Math
      
      # get data from embed container
      $embedRoot = angular.element(document).find '[data-embed-root]'
      appVersion = $embedRoot.data('app-version') if $embedRoot.data('app-version') isnt ''
      if appVersion isnt APP_INFO.version
        console.warn 'Angular TeamRaiser Participant Center: App version in HTML and JavaScript differ. Please confirm all files are up-to-date.'
      $rootScope.apiKey = $embedRoot.data('api-key') if $embedRoot.data('api-key') isnt ''
      if not $rootScope.apiKey
        new Error 'Angular TeamRaiser Participant Center: No Luminate Online API Key is defined.'
      $rootScope.siteShortname = $embedRoot.data('site-shortname') if $embedRoot.data('site-shortname') isnt ''
      $rootScope.nonsecurePath = $embedRoot.data('nonsecure-path') if $embedRoot.data('nonsecure-path') isnt ''
      $rootScope.securePath = $embedRoot.data('secure-path') if $embedRoot.data('secure-path') isnt ''
      if not luminateExtend
        new Error 'Angular TeamRaiser Participant Center: No LuminateExtend available'
      else
        luminateExtend.init
          apiKey: $rootScope.apiKey
          path:
            nonsecure: $rootScope.nonsecurePath
            secure: $rootScope.securePath
      $rootScope.frId = $embedRoot.data('fr-id') if $embedRoot.data('fr-id') isnt ''
      if not $rootScope.frId
        new Error 'Angular TeamRaiser Participant Center: No TeamRaiser ID is defined.'
      $rootScope.locale = $embedRoot.data('locale') if $embedRoot.data('locale') isnt ''
      if not $rootScope.locale
        $rootScope.locale = 'en_US'
      $rootScope.consId = $embedRoot.data('cons-id') if $embedRoot.data('cons-id') isnt ''
      $rootScope.authToken = $embedRoot.data('auth-token') if $embedRoot.data('auth-token') isnt ''
      $rootScope.socialSettings =
        appName: $embedRoot.data('janrain-appname') or ''
        appUrl: ''
        providers: []
        janrainEnabled: false
        janrainInitialized: false
        shareTitle: ''
        shareAction: ''
        shareMessage: ''
        shareId: 'TR-' + $rootScope.frId
        shareUrl: ''
  ]

angular.element(document).ready ->
  if not angular.element(document).injector()
    angular.bootstrap document, [
      'trPcApp'
    ]