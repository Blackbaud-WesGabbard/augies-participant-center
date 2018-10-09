angular.module 'trPcApp'
  .config [
  	'formlyConfigProvider'
    'APP_INFO'
    (formlyConfigProvider, APP_INFO) ->
      formlyConfigProvider.setType(
        name: 'username'
        extends: 'input'
        templateUrl: APP_INFO.rootPath + 'html/directive/formlyUsername.html'
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
        defaultOptions:
          templateOptions:
            changePasswordLabel: 'Change Password'
      )
      formlyConfigProvider.setType(
        name: 'datepicker'
        templateUrl: APP_INFO.rootPath + 'html/directive/formlyDatepicker.html'
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
        defaultOptions:
          ngModelAttrs:
            dateDisabled:
              attribute: 'date-disabled'
            customClass:
              attribute: 'custom-class'
            showWeeks:
              attribute: 'show-weeks'
            startingDay:
              attribute: 'starting-day'
            initDate:
              attribute: 'init-date'
            minMode:
              attribute: 'min-mode'
            maxMode:
              attribute: 'max-mode'
            formatDay:
              attribute: 'format-day'
            formatMonth:
              attribute: 'format-month'
            formatYear:
              attribute: 'format-year'
            formatDayHeader:
              attribute: 'format-day-header'
            formatDayTitle:
             attribute: 'format-day-title'
            formatMonthTitle:
              attribute: 'format-month-title'
            yearRange:
              attribute: 'year-range'
            shortcutPropagation:
              attribute: 'shortcut-propagation'
            datepickerPopup:
              attribute: 'datepicker-popup'
            showButtonBar:
              attribute: 'show-button-bar'
            currentText:
              attribute: 'current-text'
            clearText:
              attribute: 'clear-text'
            closeText:
              attribute: 'close-text'
            closeOnDateSelection:
              attribute: 'close-on-date-selection'
            datepickerAppendToBody:
              attribute: 'datepicker-append-to-body'
            datepickerMode:
              bound: 'datepicker-mode'
            minDate:
              bound: 'min-date'
            maxDate:
              bound: 'max-date'
          templateOptions:
            dateOptions:
              format: 'MM/dd/yyyy'
              initDate: new Date()
        controller: [
          '$scope'
          ($scope) ->
            $scope.datepicker = {};
            $scope.datepicker.opened = false;
            $scope.datepicker.open = ($event) ->
              $scope.datepicker.opened = !$scope.datepicker.opened;
        ]
      )
      formlyConfigProvider.setType({
        name: 'typeahead',
        template: '<input type="text" ng-model="model[options.key]" uib-typeahead="item for item in to.options | filter:$viewValue" class="form-control">',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions:
          ngModelAttrs:
            ngModelOptions:
              bound: 'ng-model-options'
            typeaheadAppendTo:
              bound: 'typeahead-append-to'
            typeaheadAppendToBody:
              bound: 'typeahead-append-to-body'
            typeaheadEditable:
              bound: 'typeahead-editable'
            typeaheadFocusFirst:
              bound: 'typeahead-focus-first'
            typeaheadFocusOnSelect:
              attribute: 'typeahead-focus-on-select'
            typeaheadInputFormatter:
              bound: 'typeahead-input-formatter'
            typeaheadIsOpen:
              bound: 'typeahead-is-open'
            typeaheadLoading:
              bound: 'typeahead-loading'
            typeaheadMinLength:
              bound: 'typeahead-min-length'
              value: 0
            typeaheadNoResults:
              bound: 'typeahead-no-results'
            typeaheadShouldSelect:
              bound: 'typeahead-should-select'
            typeaheadOnSelect:
              bound: 'typeahead-on-select'
            typeaheadPopupTemplateUrl:
              attribute: 'typeahead-popup-template-url'
            typeaheadSelectOnBlur:
              bound: 'typeahead-select-on-blur'
            typeaheadSelectOnExact:
              bound: 'typeahead-select-on-exact'
            typeaheadShowHint:
              bound: 'typeahead-show-hint'
            typeaheadTemplateUrl:
              attribute: 'typeahead-template-url'
            typeaheadWaitMs:
              bound: 'typeahead-wait-ms'
      });
      formlyConfigProvider.setType(
        name: 'caption'
        template: '<div class="formly-form-caption" ng-bind-html="to.label"></div>'
        wrapper: ['bootstrapHasError']
      )
      formlyConfigProvider.setType(
        name: 'hidden'
        template: '<div class="formly-form-hidden"><input type="hidden" ng-model="model[options.key]"></div>'
      )
      formlyConfigProvider.setType(
        name: 'captcha'
        template: '<div class="formly-form-captcha"></div>'
        # todo?
      )
      formlyConfigProvider
  ]