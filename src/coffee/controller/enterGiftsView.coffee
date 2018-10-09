angular.module 'trPcControllers'
  .controller 'EnterGiftsViewCtrl', [
    '$scope'
    '$location'
    '$translate'
    '$timeout'
    '$httpParamSerializer'
    'TeamraiserEventService'
    'TeamraiserGiftService'
    ($scope, $location, $translate, $timeout, $httpParamSerializer, TeamraiserEventService, TeamraiserGiftService) ->
      $scope.enterGiftsPromises = []
      
      paymentTypeOptions = []
      
      if $scope.teamraiserConfig.offlineGiftTypes.cash is 'true'
        paymentTypeOptions.push
          value: 'cash'
          name: 'Cash'
      if $scope.teamraiserConfig.offlineGiftTypes.check is 'true'
        paymentTypeOptions.push
          value: 'check'
          name: 'Check'
      if $scope.teamraiserConfig.offlineGiftTypes.credit is 'true'
        paymentTypeOptions.push
          value: 'credit'
          name: 'Credit'
      if $scope.teamraiserConfig.offlineGiftTypes.later is 'true'
        paymentTypeOptions.push
          value: 'later'
          name: 'Pay Later'

      getPaymentTypeTranslations = ->
        if $scope.getPaymentTypeTranslationsTimeout
          $timeout.cancel $scope.getPaymentTypeTranslationsTimeout
        $translate [ 'gift_payment_type_cash', 'gift_payment_type_check', 'gift_payment_type_credit', 'gift_payment_type_later' ]
          .then (translations) ->
            angular.forEach paymentTypeOptions, (ptOpt) ->
              switch ptOpt.value
                when 'cash' then ptOpt.name = translations.gift_payment_type_cash
                when 'check' then ptOpt.name = translations.gift_payment_type_check
                when 'credit' then ptOpt.name = translations.gift_payment_type_credit
                when 'later' then ptOpt.name = translations.gift_payment_type_later
          , (translationIds) ->
            $scope.getPaymentTypeTranslationsTimeout = $timeout getPaymentTypeTranslations, 500
      getPaymentTypeTranslations()

      today = new Date()
      ccExpMonthOptions = ({ name: ('0'+num).slice(-2) } for num in [1..12])
      ccExpMonthDefault = ('0'+(today.getMonth()+1).toString()).slice(-2)
      ccExpYearOptions = ({ name: num.toString() } for num in [today.getFullYear()..today.getFullYear()+10])
      ccExpYearDefault = today.getFullYear().toString()

      $scope.egvm = 
        giftModel: {}
        giftFields: [
          {
            type: 'input'
            key: 'first_name'
            templateOptions:
              label: 'First Name:'
              required: true
          }
          {
            type: 'input'
            key: 'last_name'
            templateOptions:
              label: 'Last Name:'
              required: true
          }
          {
            type: 'input'
            key: 'email'
            templateOptions:
              label: 'Email:'
          }
          {
            type: 'checkbox'
            key: 'showAdditionalFields'
            defaultValue: false
            templateOptions:
              label: 'Show donor address fields'
          }
          {
            type: 'input'
            key: 'street1'
            hideExpression: "!model.showAdditionalFields"
            templateOptions:
              label: 'Address:'
          }
          {
            type: 'input'
            key: 'street2'
            hideExpression: "!model.showAdditionalFields"
            templateOptions:
              label: 'Address 2:'
          }
          {
            type: 'input'
            key: 'city'
            hideExpression: "!model.showAdditionalFields"
            templateOptions:
              label: 'City:'
          }
          {
            type: 'input'
            key: 'state'
            hideExpression: "!model.showAdditionalFields"
            templateOptions:
              label: 'State:'
          }
          {
            type: 'input'
            key: 'zip'
            hideExpression: "!model.showAdditionalFields"
            templateOptions:
              label: 'Zip:'
          }
          {
            type: 'input'
            key: 'gift_display_name'
            templateOptions:
              label: 'Recognition Name:'
          }
          {
            type: 'checkbox'
            key: 'gift_display_amount'
            defaultValue: true
            templateOptions:
              label: 'Yes, display the amount of this gift.'
          }
          {
            type: 'checkbox'
            key: 'team_gift'
            defaultValue: false
            hideExpression: "model.hideTeamGiftOption"
            templateOptions:
              label: 'Record this gift on behalf of my entire team.'
          }
          {
            type: 'input'
            key: 'gift_amount'
            templateOptions:
              label: 'Amount:'
              required: true
          }
          {
            type: 'select'
            key: 'payment_type'
            templateOptions:
              label: 'Payment Type:'
              options: paymentTypeOptions
          }
          {
            type: 'input'
            key: 'check_number'
            hideExpression: "model.payment_type != 'check'"
            templateOptions:
              label: 'Check Number:'
          }
          {
            type: 'input'
            key: 'credit_card_number'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Credit Card Number:'
          }
          {
            type: 'select'
            key: 'credit_card_month'
            hideExpression: "model.payment_type != 'credit'"
            defaultValue: ccExpMonthDefault
            templateOptions:
              label: 'Credit Card Expiration Month:'
              valueProp: 'name'
              options: ccExpMonthOptions
          }
          {
            type: 'select'
            key: 'credit_card_year'
            hideExpression: "model.payment_type != 'credit'"
            defaultValue: ccExpYearDefault
            templateOptions:
              label: 'Credit Card Expiration Year:'
              valueProp: 'name'
              options: ccExpYearOptions
          }
          {
            type: 'input'
            key: 'credit_card_verification_code'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Verification Code:'
          }
          {
            type: 'input'
            key: 'billing_first_name'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing First Name:'
          }
          {
            type: 'input'
            key: 'billing_last_name'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing Last Name:'
          }
          {
            type: 'input'
            key: 'billing_street1'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing Address:'
          }
          {
            type: 'input'
            key: 'billing_street2'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing Address 2:'
          }
          {
            type: 'input'
            key: 'billing_city'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing City:'
          }
          {
            type: 'input'
            key: 'billing_state'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing State:'
          }
          {
            type: 'input'
            key: 'billing_zip'
            hideExpression: "model.payment_type != 'credit'"
            templateOptions:
              label: 'Billing Zip:'
          }
          {
            type: 'select'
            key: 'gift_category_id'
            hideExpression: "model.hideGiftCategoriesOption"
            templateOptions:
              label: 'Gift Category:'
              options: []
          }
        ]

      getFieldLabelTranslations = ->
        if $scope.getFieldLabelTranslationsTimeout
          $timeout.cancel $scope.getFieldLabelTranslationsTimeout
        $translate [ 'gift_first_name_label', 'gift_last_name_label', 'gift_email_label', 'gift_addl_options_label', 'gift_street1_label', 'gift_street2_label', 'gift_city_label', 'gift_state_label', 'gift_zip_label', 'gift_recongition_name_label', 'gift_display_personal_page_label', 'gift_record_team_gift', 'gift_amount_label', 'gift_payment_type_label', 'gift_check_number_label', 'gift_credit_card_number_label', 'gift_credit_expiration_date_label', 'gift_credit_verification_code_label', 'gift_billing_first_name_label', 'gift_billing_last_name_label', 'gift_billing_street1_label', 'gift_billing_street2_label', 'gift_billing_city_label', 'gift_billing_state_label', 'gift_billing_zip_label', 'gift_gift_category_label' ]
          .then (translations) ->
            angular.forEach $scope.egvm.giftFields, (giftField) ->
              switch giftField.key
                when 'first_name' then giftField.templateOptions.label = translations.gift_first_name_label
                when 'last_name' then giftField.templateOptions.label = translations.gift_last_name_label
                when 'email' then giftField.templateOptions.label = translations.gift_email_label
                when 'showAdditionalFields' then giftField.templateOptions.label = translations.gift_addl_options_label
                when 'street1' then giftField.templateOptions.label = translations.gift_street1_label
                when 'street2' then giftField.templateOptions.label = translations.gift_street2_label
                when 'city' then giftField.templateOptions.label = translations.gift_city_label
                when 'state' then giftField.templateOptions.label = translations.gift_state_label
                when 'zip' then giftField.templateOptions.label = translations.gift_zip_label
                when 'gift_display_name' then giftField.templateOptions.label = translations.gift_recongition_name_label
                when 'gift_display_amount' then giftField.templateOptions.label = translations.gift_display_personal_page_label
                when 'team_gift' then giftField.templateOptions.label = translations.gift_record_team_gift
                when 'gift_amount' then giftField.templateOptions.label = translations.gift_amount_label
                when 'payment_type' then giftField.templateOptions.label = translations.gift_payment_type_label
                when 'check_number' then giftField.templateOptions.label = translations.gift_check_number_label
                when 'credit_card_number' then giftField.templateOptions.label = translations.gift_credit_card_number_label
                when 'credit_card_month' then giftField.templateOptions.label = translations.gift_credit_expiration_date_label
                when 'credit_card_year' then giftField.templateOptions.label = translations.gift_credit_expiration_date_label
                when 'credit_card_verification_code' then giftField.templateOptions.label = translations.gift_credit_verification_code_label
                when 'billing_first_name' then giftField.templateOptions.label = translations.gift_billing_first_name_label
                when 'billing_last_name' then giftField.templateOptions.label = translations.gift_billing_last_name_label
                when 'billing_street1' then giftField.templateOptions.label = translations.gift_billing_street1_label
                when 'billing_street2' then giftField.templateOptions.label = translations.gift_billing_street2_label
                when 'billing_city' then giftField.templateOptions.label = translations.gift_billing_city_label
                when 'billing_state' then giftField.templateOptions.label = translations.gift_billing_state_label
                when 'billing_zip' then giftField.templateOptions.label = translations.gift_billing_zip_label
                when 'gift_category_id' then giftField.templateOptions.label = translations.gift_gift_category_label
              giftField.templateOptions.label = giftField.templateOptions.label.replace /\*/gm,''
          , (translationIds) ->
            $scope.getFieldLabelTranslationsTimeout = $timeout getFieldLabelTranslations, 500
      getFieldLabelTranslations()

      if $scope.teamraiserConfig.showGiftCategories is 'true'
        $scope.egvm.giftModel.hideGiftCategoriesOption = true
        giftCategoryPromise = TeamraiserGiftService.getGiftCategories()
          .then (response) ->
            giftCategories = response.data.getGiftCategoriesResponse.giftCategory
            giftCategories = [giftCategories] if not angular.isArray giftCategories
            giftCategoryOptions = []
            angular.forEach giftCategories, (giftCategory) ->
              if angular.isString giftCategory.name
                giftCategoryOptions.push
                  value: giftCategory.id
                  name: giftCategory.name
            angular.forEach $scope.egvm.giftFields, (giftField) ->
              if giftField.key is 'gift_category_id'
                giftField.templateOptions.options = angular.copy giftCategoryOptions
            $scope.egvm.giftModel.hideGiftCategoriesOption = false
            response
        $scope.enterGiftsPromises.push giftCategoryPromise
      else
        $scope.egvm.giftModel.hideGiftCategoriesOption = true

      $scope.egvm.originalFields = angular.copy($scope.egvm.giftFields)
      
      $scope.egvm.giftModel.hideTeamGiftOption = !($scope.teamraiserConfig.offlineTeamGifts is 'MEMBERS' or ($scope.teamraiserConfig.offlineTeamGifts is 'CAPTAINS' and $scope.participantRegistration.aTeamCaptain is 'true'))

      $scope.clearGiftAlerts = ->
        autoclose = $scope.egvm.giftAlerts?.addGiftSuccess and $scope.egvm.giftAlerts.addGiftSuccess
        $scope.egvm.giftAlerts =
          addGiftAttempt: false
          addGiftSuccess: false
          addGiftAgainAttempt: false
          addGiftAgainSuccess: false
          addGiftFailure: false
          addGiftFailureMessage: ''
        if autoclose then $scope.cancelGiftEntry()
      $scope.clearGiftAlerts()

      $scope.cancelGiftEntry = ->
        $location.path '/dashboard'

      $scope.addGift = ->
        if not $scope.egvm.giftAlerts.addGiftAttempt
          $scope.egvm.giftAlerts.addGiftAttempt = true
          addGiftPromise = TeamraiserGiftService.addGift $httpParamSerializer($scope.egvm.giftModel)
            .then (response) ->
              $scope.egvm.giftAlerts.addGiftAttempt = false
              if response.data.errorResponse
                $scope.egvm.giftAlerts.addGiftFailure = true
                if response.data.errorResponse.message
                  $scope.egvm.giftAlerts.addGiftFailureMessage = response.data.errorResponse.message
                else
                  $translate 'gift_submission_error'
                    .then (translation) ->
                      $scope.egvm.giftAlerts.addGiftFailureMessage = translation
                    , (translationId) ->
                      $scope.egvm.giftAlerts.addGiftFailureMessage = translationId
              else
                if $scope.egvm.giftAlerts.addGiftAgainAttempt
                  $scope.egvm.giftAlerts.addGiftAgainSuccess = true
                else
                  $scope.egvm.giftAlerts.addGiftSuccess = true
                $scope.egvm.giftOptions.resetModel()
              window.scrollTo 0, 0
              response
          $scope.enterGiftsPromises.push addGiftPromise

      $scope.addGiftClearForm = ->
        $scope.egvm.giftAlerts.addGiftAgainAttempt = true
        $scope.addGift()
  ]