angular.module 'trPcControllers'
  .controller 'ConsProfileViewCtrl', [
    '$scope'
    '$httpParamSerializer'
    '$translate'
    '$timeout'
    '$uibModal'
    'ConstituentService'
    'APP_INFO'
    ($scope, $httpParamSerializer, $translate, $timeout, $uibModal, ConstituentService, APP_INFO) ->
      $scope.consProfilePromises = []
      
      possibleFields = [
        'user_name'
        'name.title'
        'name.first'
        'name.middle'
        'name.last'
        'name.suffix'
        'name.prof_suffix'
        'email.primary_address'
        'email.accepts_email'
        'primary_address.street1'
        'primary_address.street2'
        'primary_address.street3'
        'primary_address.city'
        'primary_address.state'
        'primary_address.zip'
        'primary_address.country'
        'accepts_postal_mail'
        'home_phone'
        'birth_date'
        'gender'
        'employment.employer'
        'employment.occupation'
      ]

      $scope.cpvm =
        profileFields: []
        passwordFields: [
          {
            type: 'input'
            key: 'old_password'
            templateOptions:
              type: 'password'
              label: 'Old Password'
              required: true
          }
          {
            type: 'input'
            key: 'user_password'
            templateOptions:
              type: 'password'
              label: 'New Password'
              required: true
          }
          {
            type: 'input'
            key: 'retype_password'
            templateOptions:
              type: 'password'
              label: 'Retype Password'
              required: true
          }
          {
            type: 'input'
            key: 'reminder_hint'
            templateOptions:
              type: 'text'
              label: 'Reminder Hint'
              required: true
          }
        ]
        profileModel: {}
        passwordModel:
          old_password: ''
          user_password: ''
          retype_password: ''
          reminder_hint: ''
        openChangePassword: $scope.openChangePassword
        cancelChangePassword: $scope.cancelChangePassword
        submitChangePassword: $scope.submitChangePassword
        updateUserProfile: $scope.updateUserProfile

      getFieldLabelTranslations = ->
        if $scope.getFieldLabelTranslationsTimeout
          $timeout.cancel $scope.getFieldLabelTranslationsTimeout
        $translate [ 'old_password', 'new_password', 'new_password_repeat', 'password_hint' ]
          .then (translations) ->
            angular.forEach $scope.cpvm.passwordFields, (passwordField) ->
              switch passwordField.key
                when 'old_password' then passwordField.templateOptions.label = translations.old_password
                when 'user_password' then passwordField.templateOptions.label = translations.new_password
                when 'retype_password' then passwordField.templateOptions.label = translations.new_password_repeat
                when 'reminder_hint' then passwordField.templateOptions.label = translations.password_hint
          , (translationIds) ->
            $scope.getFieldLabelTranslationsTimeout = $timeout getFieldLabelTranslations, 500
      getFieldLabelTranslations()

      $scope.openChangePassword = ->
        $scope.changePasswordModal = $uibModal.open 
          scope: $scope
          appendTo: angular.element(document).find 'div.ng-pc-container'
          templateUrl: APP_INFO.rootPath + 'html/modal/changePassword.html'

      $scope.cancelChangePassword = ($event) ->
        $event.preventDefault()
        $scope.changePasswordModal.close()

      $scope.getUser = ->
        getUserPromise = ConstituentService.getUser()
          .then (response) ->
            $scope.constituent = response.data.getConsResponse
            angular.forEach $scope.cpvm.profileFields, (profileField) ->
              fieldName = profileField.name
              fieldValue = null
              # first check for "custom" fields
              if fieldName.indexOf("custom_") > -1
                customFieldType = fieldName.slice(7).replace(/\d+/g,"")
                if $scope.constituent.custom and $scope.constituent.custom[customFieldType]
                  angular.forEach $scope.constituent.custom[customFieldType], (customField) ->
                    if fieldName is customField.id 
                      fieldValue = customField.content
              else if fieldName.indexOf(".") > -1
              # next check for "nested" fields
                fieldName = fieldName.split "."
                tempPath = $scope.constituent
                for i in [0..fieldName.length-1]
                  if tempPath[fieldName[i]]
                    tempPath = tempPath[fieldName[i]]
                if tempPath and not angular.isObject(tempPath)
                  fieldValue = tempPath
              else if $scope.constituent[fieldName] and not angular.isObject($scope.constituent[fieldName])
              # next check to see if the field exists in getUser response
                fieldValue = $scope.constituent[fieldName]
              if fieldValue
                # now convert field value from text to appropriate data type
                switch profileField.data.dataType
                  when'DATE'
                    # expected date format is a badly-formed date string: "yyyy-MM-dd-hh:mm"
                    fieldValue = fieldValue.split "-"
                    fieldValue = new Date parseInt(fieldValue[0]), parseInt(fieldValue[1])-1, parseInt(fieldValue[2]), parseInt(fieldValue[3].split(":")[0]), parseInt(fieldValue[3].split(":")[1])
                  when 'BOOLEAN'
                    fieldValue = fieldValue is 'true'
                  else
                    fieldValue = fieldValue
              else fieldValue = null
              # finally assign value to model
              $scope.cpvm.profileModel[profileField.key] = fieldValue
            if $scope.constituent.reminder_hint
              $scope.cpvm.passwordModel["reminder_hint"] = $scope.constituent.reminder_hint
            $scope.cpvm.profileOptions.updateInitialValue()
            response
        $scope.consProfilePromises.push getUserPromise

      listUserFieldsPromise = ConstituentService.listUserFields 'access=update'
        .then (response) ->
          $scope.userFields = response.data.listConsFieldsResponse.field
          $scope.userFields = [$scope.userFields] if not angular.isArray $scope.userFields
          angular.forEach $scope.userFields, (userField) ->
            if possibleFields.indexOf(userField.name) > -1
              thisField = 
                type: null
                key: userField.name.replace('.','-')
                name: userField.name
                data:
                  dataType: userField.valueType
                  orderInd: possibleFields.indexOf userField.name
                templateOptions:
                  label: userField.label
                  required: userField.required is 'true'
                  maxChars: userField.maxChars
              switch userField.valueType
                when 'BOOLEAN'
                  thisField.type = 'checkbox'
                when 'DATE'
                  thisField.type = 'datepicker'
                  thisField.templateOptions.placeholder = 'MM/dd/yyyy'
                  thisField.templateOptions.closeText = 'Close'
                  thisField.templateOptions.dateOptions = 
                    dateFormat: 'MM/dd/yyyy'
                  if userField.choices?.choice
                    minYear = maxYear = userField.choices.choice[0]
                    minYear = (if minYear < choice then minYear else choice) for choice in userField.choices.choice
                    maxYear = (if maxYear > choice then maxYear else choice) for choice in userField.choices.choice
                    thisField.templateOptions.dateOptions.minDate = new Date minYear, 0, 1
                    thisField.templateOptions.dateOptions.maxDate = new Date maxYear, 11, 31
                  thisField.templateOptions.dateAltFormats = [
                    'dd-MMMM-yyyy'
                    'yyyy/MM/dd'
                    'dd.MM.yyyy'
                    'shortDate'
                  ]
                when 'ENUMERATION'
                  thisField.type = 'select'
                  thisField.templateOptions.options = []
                  angular.forEach userField.choices.choice, (choice) ->
                    thisField.templateOptions.options.push
                      name: if choice is 'UNDEFINED' then '' else choice
                      value: choice
                when 'TEXT'
                  if userField.choices?.choice
                    thisField.type = 'select'
                    thisField.templateOptions.options = []
                    angular.forEach userField.choices.choice, (choice) ->
                      thisField.templateOptions.options.push
                        name: choice
                        value: choice
                  else thisField.type = 'input'
                else thisField.type = 'input'
              if userField.name is 'user_name'
                thisField.type = 'username'
                thisField.templateOptions.changePasswordLabel = 'Change Password'
                thisField.templateOptions.changePasswordAction = $scope.openChangePassword
              $scope.cpvm.profileFields.push thisField
          $scope.cpvm.profileFields.sort (a,b) ->
            a.data.orderInd - b.data.orderInd
          $translate [ 'accept_email_label', 'accept_postal_mail_label', 'change_password_label' ]
            .then (translations) ->
              angular.forEach $scope.cpvm.profileFields, (profileField) ->
                switch profileField.name
                  when 'accepts_postal_mail' then profileField.templateOptions.label = translations.accept_postal_mail_label
                  when 'email.accepts_email' then profileField.templateOptions.label = translations.accept_email_label
                  when 'user_name' then profileField.templateOptions.changePasswordLabel = translations.change_password_label
              $scope.cpvm.originalFields = angular.copy($scope.cpvm.profileFields)
            , (translationIds) ->
              angular.forEach $scope.cpvm.profileFields, (profileField) ->
                switch profileField.name
                  when 'accepts_postal_mail' then profileField.templateOptions.label = translationIds.accept_postal_mail_label
                  when 'email.accepts_email' then profileField.templateOptions.label = translationIds.accept_email_label
                  when 'user_name' then profileField.templateOptions.changePasswordLabel = translationIds.change_password_label
              $scope.cpvm.originalFields = angular.copy($scope.cpvm.profileFields)
          $scope.getUser()
          response
      $scope.consProfilePromises.push listUserFieldsPromise

      $scope.updateUserProfile = -> 
        if $scope.cpvm.profileForm.$valid
          userProfileUpdateFields = {}
          angular.forEach $scope.cpvm.profileModel, (value, key) ->
            fixedKey = key.replace '-', '.'
            userProfileUpdateFields[fixedKey] = value
          updateUserPromise = ConstituentService.update $httpParamSerializer(userProfileUpdateFields)
            .then (response) ->
              if response.data.errorResponse
                $scope.updateProfileSuccess = false
                $scope.updateProfileFailure = true
                if response.data.errorResponse.message
                  $scope.updateProfileFailureMessage = response.data.errorResponse.message
                else
                  $translate 'profile_update_unexpected_error'
                    .then (translation) ->
                      $scope.updateProfileFailureMessage = translation
                    , (translationId) ->
                      $scope.updateProfileFailureMessage = translationId
              else
                $scope.updateProfileSuccess = true
                $scope.updateProfileFailure = false
                $scope.cpvm.profileOptions.updateInitialValue()
              response
          $scope.consProfilePromises.push updateUserPromise
        else
          $translate 'profile_update_required_error'
            .then (translation) ->
              $scope.updateProfileFailureMessage = translation
            , (translationId) ->
              $scope.updateProfileFailureMessage = translationId
          $scope.updateProfileSuccess = false
          $scope.updateProfileFailure = true

      $scope.submitChangePassword = ->
        changePasswordPromise = ConstituentService.changePassword $httpParamSerializer($scope.cpvm.passwordModel)
          .then (response) ->
            if response.data.errorResponse
              $scope.updatePasswordSuccess = false
              $scope.updatePasswordFailure = true
              if response.data.errorResponse.message
                $scope.updatePasswordFailureMessage = response.data.errorResponse.message
              else
                $translate 'profile_update_unexpected_error'
                  .then (translation) ->
                    $scope.updatePasswordFailureMessage = translation
                  , (translationId) ->
                    $scope.updatePasswordFailureMessage = translationId
              $scope.cpvm.passwordOptions.resetModel()
            else
              $scope.updatePasswordSuccess = true
              $scope.updatePasswordFailure = false
              $scope.changePasswordModal.close()
              reminderValue = $scope.cpvm.passwordModel["reminder_hint"]
              $scope.cpvm.passwordOptions.resetModel()
              $scope.cpvm.passwordModel["reminder_hint"] = reminderValue
              $scope.cpvm.passwordOptions.updateInitialValue()
            response
        $scope.consProfilePromises.push changePasswordPromise

      $scope.resetProfileAlerts = ->
        $scope.updateProfileSuccess = false
        $scope.updateProfileFailure = false
        $scope.updateProfileFailureMessage = ''
        $scope.updatePasswordSuccess = false
        $scope.updatePasswordFailure = false
        $scope.updatePasswordFailureMessage = ''
        true
      $scope.resetProfileAlerts()
      
  ]