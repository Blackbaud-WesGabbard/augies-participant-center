angular.module 'trPcApp'
  .factory 'TeamraiserCompanyService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      getCompanyList: ->
        LuminateRESTService.teamraiserRequest 'method=getCompanyList', true, true
          .then (response) ->
            response

      getCompanies: (requestData) ->
        dataString = 'method=getCompaniesByInfo'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, false, true
          .then (response) ->
            response

      getCompany: ->
        this.getCompanies 'company_id=' + $rootScope.participantRegistration?.companyInformation?.companyId
          .then (response) ->
            response
  ]