angular.module 'trPcApp'
  .directive 'socialShare', [ 
    '$interval'
    'SocialShareService'
    ($interval, SocialShareService) ->
      template: '<div class="janrainSocialPlaceholder"></div>'
      restrict: 'E'
      replace: true
      scope:
        sharePage: '<'
      link: (scope, element, attrs) ->
        if scope.sharePage
          SocialShareService.activateJanrain element, scope.sharePage
        else
          scope.shareWatch = $interval () ->
            if scope.sharePage and scope.sharePage.match 'http'
              SocialShareService.activateJanrain element, scope.sharePage
              $interval.cancel scope.shareWatch
          , 1000
  ]