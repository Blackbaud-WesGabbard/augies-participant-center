angular.module 'trPcApp'
  .factory 'LuminateRESTService', [
    '$rootScope'
    '$q'
    '$http'
    '$timeout'
    '$uibModal'
    'APP_INFO'
    ($rootScope, $q, $http, $timeout, $uibModal, APP_INFO) ->
      request: (apiServlet, requestData, includeAuth, includeFrId) ->
        if not requestData
          new Error 'Angular TeamRaiser Participant Center: API request for ' + apiServlet + ' with no requestData'
        else
          if not $rootScope.apiKey
            $embedRoot = angular.element(document).find '[data-embed-root]'
            $rootScope.apiKey = $embedRoot.data('api-key') if $embedRoot.data('api-key') isnt ''
            if not $rootScope.apiKey
              new Error 'Angular TeamRaiser Participant Center: No Luminate Online API Key is defined.'
              $timeout this.request, 500, true, apiServlet, requestData, includeAuth, includeFrId
            else
              this.request apiServlet, requestData, includeAuth, includeFrId
          else
            requestData += '&v=1.0&api_key=' + $rootScope.apiKey + '&response_format=json&suppress_response_codes=true&ng_tr_pc_v=' + APP_INFO.version
            if includeAuth and not $rootScope.authToken
              new Error 'Angular TeamRaiser Participant Center: No Luminate Online auth token is defined.'
            else
              if includeAuth
                requestData += '&auth=' + $rootScope.authToken
              if includeFrId
                requestData += '&fr_id=' + $rootScope.frId + '&s_trID=' + $rootScope.frId
              if $rootScope.locale
                requestData += '&s_locale=' + $rootScope.locale
              $http
                method: 'POST'
                url: apiServlet
                data: requestData
                headers:
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              .then (response) ->
                # TODO: check for error code 204 except for when method is login, 2603 except for when method is getRegistration
                if response.data.errorResponse and ['3', '5', '14', '2604'].indexOf(response.data.errorResponse.code) isnt -1
                  if not $rootScope.loginModal
                    $rootScope.loginModal = $uibModal.open 
                      scope: $rootScope
                      backdrop: 'static'
                      templateUrl: APP_INFO.rootPath + 'html/modal/login.html'
                  $q.reject()
                else
                  response

      addressBookRequest: (requestData, includeAuth) ->
        this.request 'CRAddressBookAPI', requestData, includeAuth, false
      
      consRequest: (requestData, includeAuth) ->
        this.request 'CRConsAPI', requestData, includeAuth, false
      
      contentRequest: (requestData, includeAuth) ->
        this.request 'CRContentAPI', requestData, includeAuth, false
      
      teamraiserRequest: (requestData, includeAuth, includeFrId) ->
        this.request 'CRTeamraiserAPI', requestData, includeAuth, includeFrId
  ]