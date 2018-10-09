angular.module 'trPcApp'
  .factory 'SocialShareService', [
    '$rootScope'
    '$cookies'
    '$window'
    'ConstituentService'
    'PageBuilderService'
    'TeamraiserEventService'
    ($rootScope, $cookies, $window, ConstituentService, PageBuilderService, TeamraiserEventService) ->
      logShare: (userId, provider) ->
        params = ''
        params += 'social_uid=' + encodeURIComponent(userId)
        params += '&social_site=' + provider
        params += '&share_url=' + encodeURIComponent($window.location.href)
        params += '&share_id=' + encodeURIComponent($rootScope.socialSettings.shareId)
        ConstituentService.logSocialShare params
          .then (response) ->
            response

      activateJanrain: (elem, sharePage) ->
        if $rootScope.socialSettings.janrainEnabled and $window.janrain? and elem?.length
          shareInstance =
            message: $rootScope.socialSettings.shareMessage
            url: sharePage or ''
          $window.janrain.social.addWidgetTo elem[0], shareInstance
          $window.janrain

      initJanrain: ->
        janrainAppName = $cookies.get('janrainEngageAppName')
        $rootScope.socialSettings.appName = janrainAppName or $rootScope.socialSettings.appName
        $rootScope.socialSettings.appUrl = "https://" + $rootScope.socialSettings.appName + ".rpxnow.com"
        try
          $rootScope.socialSettings.providers = JSON.parse atob $cookies.get('janrainShareProviders')
        catch error
          console.log "janrainShareProviders cookie error: #{error}"
          $rootScope.socialSettings.providers = [
            "native-facebook"
            "native-googleplus"
            "native-pinterest"
            "native-reddit"
            "native-tumblr"
            "native-twitter"
          ]
        if not $window.janrain?.settings?
          $window.janrain =
            settings: {}
        $window.janrain.settings.appUrl = $rootScope.socialSettings.appUrl
        $window.janrain.settings.social = 
          shareCountMode: 'none'
          orientation: 'horizontal'
          providers: $rootScope.socialSettings.providers
        $window.janrain.logShare = (userId, provider) ->
          params = ''
          params += 'social_uid=' + encodeURIComponent(userId)
          params += '&social_site=' + provider
          params += '&share_url=' + encodeURIComponent($window.location.href)
          params += '&share_id=' + encodeURIComponent($rootScope.socialSettings.shareId)
          ConstituentService.logSocialShare params
            .then (response) ->
              response
        if not $window.janrain?.social?
          PageBuilderService.loadScript '//cdn-social.janrain.com/social/janrain-social.min.js'
            .then (response) ->
              TeamraiserEventService.getParticipantCenterWrapper()
                .then (response) ->
                  if response?.data?.getParticipantCenterWrapperResponse?.wrapper?
                    wrapper = response.data.getParticipantCenterWrapperResponse.wrapper
                    $rootScope.socialSettings.janrainEnabled = wrapper.isJanrainEnabled
                    $rootScope.socialSettings.shareTitle = wrapper.shareTitle
                    $rootScope.socialSettings.shareAction = wrapper.shareAction
                    $rootScope.socialSettings.shareMessage = wrapper.shareMessage
                    $rootScope.socialSettings.shareId = wrapper.shareId unless not wrapper.shareId?
                  $window.janrain.social.on "share_done", (data) ->
                    window.janrain.logShare data.auth_token, data.provider
                    data
                  $rootScope.socialSettings.janrainInitialized = true
                  response
        else
          TeamraiserEventService.getParticipantCenterWrapper()
            .then (response) ->
              if response?.data?.getParticipantCenterWrapperResponse?.wrapper?
                wrapper = response.data.getParticipantCenterWrapperResponse.wrapper
                $rootScope.socialSettings.janrainEnabled = wrapper.isJanrainEnabled
                $rootScope.socialSettings.shareTitle = wrapper.shareTitle
                $rootScope.socialSettings.shareAction = wrapper.shareAction
                $rootScope.socialSettings.shareMessage = wrapper.shareMessage
                $rootScope.socialSettings.shareId = wrapper.shareId unless not wrapper.shareId?
              $window.janrain.social.on "share_done", (data) ->
                window.janrain.logShare data.auth_token, data.provider
                data
              $rootScope.socialSettings.janrainInitialized = true
              response
  ]