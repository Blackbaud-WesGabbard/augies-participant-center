angular.module 'trPcControllers'
  .controller 'SurveyQuestionsViewCtrl', [
    '$scope'
    '$translate'
    '$httpParamSerializer'
    'TeamraiserSurveyResponseService'
    ($scope, $translate, $httpParamSerializer, TeamraiserSurveyResponseService) ->
      $scope.surveyResponsePromises = []

      $scope.sqvm =
        surveyFields: []
        surveyModel: {}
        updateSurveyResponses: $scope.updateSurveyResponses
      
      $scope.getSurveyResponses = ->
        getSurveyResponsesPromise = TeamraiserSurveyResponseService.getSurveyResponses()
          .then (response) ->
            surveyResponses = response.data.getSurveyResponsesResponse.responses
            surveyResponses = [surveyResponses] if not angular.isArray surveyResponses
            angular.forEach surveyResponses, (surveyResponse) ->
              if surveyResponse
                thisField = 
                  type: null
                  key: 'question_' + surveyResponse.questionId
                  data:
                    dataType: surveyResponse.questionType
                  templateOptions:
                    label: surveyResponse.questionText
                    required: surveyResponse.questionRequired is 'true'
                switch surveyResponse.questionType
                  when 'Caption'
                    thisField.type = 'caption'
                  when 'DateQuestion'
                    thisField.type = 'datepicker'
                  when 'NumericValue'
                    thisField.type = 'input'
                  when 'ShortTextValue'
                    thisField.type = 'input'
                    thisField.templateOptions.maxChars = 40
                  when 'TextValue' 
                    thisField.type = 'input'
                    thisField.templateOptions.maxChars = 255
                  when 'LargeTextValue'
                    thisField.type = 'textarea'
                  when 'TrueFalse'
                    thisField.type = 'select'
                  when 'YesNo'
                    thisField.type = 'select'
                  when 'MultiSingle'
                    thisField.type = 'select'
                  when 'ComboChoice'
                    thisField.type = 'typeahead'
                  when 'Categories'
                    thisField.type = 'checkbox'
                  when 'MultiMulti'
                    thisField.type = 'checkbox'
                  when 'MultiSingleRadio'
                    thisField.type = 'radio'
                  when 'RatingScale'
                    thisField.type = 'radio'
                  when 'Captcha'
                    thisField.type = 'captcha'
                  when 'HiddenInterests'
                    thisField.type = 'hidden'
                  when 'HiddenTextValue'
                    thisField.type = 'hidden'
                  when 'HiddenTrueFalse'
                    thisField.type = 'hidden'
                  else thisField.type = 'input'
                thisField.type = 'hidden' if surveyResponse.isHidden is 'true'
                if surveyResponse.questionAnswer
                  thisField.templateOptions.options = []
                  angular.forEach surveyResponse.questionAnswer, (choice) ->
                    thisField.templateOptions.options.push
                      name: choice.label
                      value: choice.value
                $scope.sqvm.surveyFields.push thisField
                if surveyResponse.responseValue is 'User Provided No Response'
                  $scope.sqvm.surveyModel[thisField.key] = null
                else if thisField.type is 'datepicker'
                  fieldValue = surveyResponse.responseValue.split "-"
                  $scope.sqvm.surveyModel[thisField.key] = new Date parseInt(fieldValue[0]), parseInt(fieldValue[1])-1, parseInt(fieldValue[2]), parseInt(fieldValue[3].split(":")[0]), parseInt(fieldValue[3].split(":")[1])
                else if thisField.type is 'checkbox'
                  $scope.sqvm.surveyModel[thisField.key] = surveyResponse.responseValue is 'true'
                else
                  $scope.sqvm.surveyModel[thisField.key] = surveyResponse.responseValue
            $scope.sqvm.originalFields = angular.copy($scope.sqvm.surveyFields)
            response
        $scope.surveyResponsePromises.push getSurveyResponsesPromise
      $scope.getSurveyResponses()
      
      $scope.updateSurveyResponses = ($event) ->
        $event.preventDefault()
        updateSurveyResponsesPromise = TeamraiserSurveyResponseService.updateSurveyResponses $httpParamSerializer($scope.sqvm.surveyModel)
        .then (response) ->
            if response.data.errorResponse
              $scope.updateSurveySuccess = false
              $scope.updateSurveyFailure = true
              if response.data.errorResponse.message
                $scope.updateSurveyFailureMessage = response.data.errorResponse.message
              else
                $translate 'survey_save_failure'
                  .then (translation) ->
                    $scope.updateSurveyFailureMessage = translation
                  , (translationId) ->
                    $scope.updateSurveyFailureMessage = translationId
            else
              $scope.updateSurveySuccess = true
              $scope.updateSurveyFailure = false
              $scope.sqvm.surveyOptions.updateInitialValue()
            response
        $scope.surveyResponsePromises.push updateSurveyResponsesPromise

      $scope.resetSurveyAlerts = ->
        $scope.updateSurveySuccess = false
        $scope.updateSurveyFailure = false
        $scope.updateSurveyFailureMessage = ''
      $scope.resetSurveyAlerts()
  ]