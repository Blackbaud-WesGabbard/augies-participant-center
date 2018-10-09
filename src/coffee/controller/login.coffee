angular.module 'trPcControllers'
  .controller 'LoginCtrl', [
    '$rootScope'
    '$scope'
    '$route'
    '$httpParamSerializer'
    '$translate'
    '$window'
    'AuthService'
    ($rootScope, $scope, $route, $httpParamSerializer, $translate, $window, AuthService) ->
      $scope.resetLoginAlerts = ->
        if $scope.loginError
          delete $scope.loginError
      
      setUserNameOrPasswordError = ->
        $translate 'error_invalid_username_or_password'
          .then (translation) ->
            $scope.loginError = translation
          , (translationId) ->
            $scope.loginError = translationId
      
      # TODO: cache user_name after user logs in so they don't have to enter it if they get timed out
      $scope.consLogin = 
        user_name: ''
        password: ''
      
      $scope.submitLogin = ->
        if $scope.consLogin.user_name is '' or $scope.consLogin.password is ''
          setUserNameOrPasswordError()
        else
          $scope.resetLoginAlerts()
          
          AuthService.login $httpParamSerializer($scope.consLogin)
            .then (response) ->
              errorResponse = response.data.errorResponse
              if errorResponse
                if ['200', '201', '202', '204'].indexOf(errorResponse.code)
                  setUserNameOrPasswordError()
                else
                  $scope.loginError = errorResponse.message
              else
                consId = response.data.loginResponse.cons_id
                if Number(consId) isnt Number($rootScope.consId)
                  $window.location.reload()
                else
                  if $rootScope.loginModal
                    $rootScope.loginModal.close()
                    delete $rootScope.loginModal
                  angular.element(document).find('.modal').click()
                  $rootScope.consId = response.data.loginResponse?.cons_id or -1
                  delete $rootScope.authToken
                  $route.reload()
  ]