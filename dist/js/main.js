(function() {
  angular.module('trPcApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'cgBusy', 'pascalprecht.translate', 'textAngular', 'formly', 'formlyBootstrap', 'trPcControllers']);

  angular.module('trPcControllers', []);

  angular.module('trPcApp').constant('APP_INFO', {
    version: '1.0',
    rootPath: '../angular-teamraiser-participant-center/dist/'
  });

  angular.module('trPcApp').run([
    '$rootScope', '$window', 'APP_INFO', function($rootScope, $window, APP_INFO) {
      var $embedRoot, appVersion;
      $rootScope.Math = $window.Math;
      $embedRoot = angular.element(document).find('[data-embed-root]');
      if ($embedRoot.data('app-version') !== '') {
        appVersion = $embedRoot.data('app-version');
      }
      if (appVersion !== APP_INFO.version) {
        console.warn('Angular TeamRaiser Participant Center: App version in HTML and JavaScript differ. Please confirm all files are up-to-date.');
      }
      if ($embedRoot.data('api-key') !== '') {
        $rootScope.apiKey = $embedRoot.data('api-key');
      }
      if (!$rootScope.apiKey) {
        new Error('Angular TeamRaiser Participant Center: No Luminate Online API Key is defined.');
      }
      if ($embedRoot.data('site-shortname') !== '') {
        $rootScope.siteShortname = $embedRoot.data('site-shortname');
      }
      if ($embedRoot.data('nonsecure-path') !== '') {
        $rootScope.nonsecurePath = $embedRoot.data('nonsecure-path');
      }
      if ($embedRoot.data('secure-path') !== '') {
        $rootScope.securePath = $embedRoot.data('secure-path');
      }
      if (!luminateExtend) {
        new Error('Angular TeamRaiser Participant Center: No LuminateExtend available');
      } else {
        luminateExtend.init({
          apiKey: $rootScope.apiKey,
          path: {
            nonsecure: $rootScope.nonsecurePath,
            secure: $rootScope.securePath
          }
        });
      }
      if ($embedRoot.data('fr-id') !== '') {
        $rootScope.frId = $embedRoot.data('fr-id');
      }
      if (!$rootScope.frId) {
        new Error('Angular TeamRaiser Participant Center: No TeamRaiser ID is defined.');
      }
      if ($embedRoot.data('locale') !== '') {
        $rootScope.locale = $embedRoot.data('locale');
      }
      if (!$rootScope.locale) {
        $rootScope.locale = 'en_US';
      }
      if ($embedRoot.data('cons-id') !== '') {
        $rootScope.consId = $embedRoot.data('cons-id');
      }
      if ($embedRoot.data('auth-token') !== '') {
        $rootScope.authToken = $embedRoot.data('auth-token');
      }
      return $rootScope.socialSettings = {
        appName: $embedRoot.data('janrain-appname') || '',
        appUrl: '',
        providers: [],
        janrainEnabled: false,
        janrainInitialized: false,
        shareTitle: '',
        shareAction: '',
        shareMessage: '',
        shareId: 'TR-' + $rootScope.frId,
        shareUrl: ''
      };
    }
  ]);

  angular.element(document).ready(function() {
    if (!angular.element(document).injector()) {
      return angular.bootstrap(document, ['trPcApp']);
    }
  });

  angular.module('trPcApp').value('cgBusyDefaults', {
    message: 'Loading ...',
    minDuration: 500
  });

  angular.module('trPcApp').config([
    'formlyConfigProvider', 'APP_INFO', function(formlyConfigProvider, APP_INFO) {
      formlyConfigProvider.setType({
        name: 'username',
        "extends": 'input',
        templateUrl: APP_INFO.rootPath + 'html/directive/formlyUsername.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions: {
          templateOptions: {
            changePasswordLabel: 'Change Password'
          }
        }
      });
      formlyConfigProvider.setType({
        name: 'datepicker',
        templateUrl: APP_INFO.rootPath + 'html/directive/formlyDatepicker.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions: {
          ngModelAttrs: {
            dateDisabled: {
              attribute: 'date-disabled'
            },
            customClass: {
              attribute: 'custom-class'
            },
            showWeeks: {
              attribute: 'show-weeks'
            },
            startingDay: {
              attribute: 'starting-day'
            },
            initDate: {
              attribute: 'init-date'
            },
            minMode: {
              attribute: 'min-mode'
            },
            maxMode: {
              attribute: 'max-mode'
            },
            formatDay: {
              attribute: 'format-day'
            },
            formatMonth: {
              attribute: 'format-month'
            },
            formatYear: {
              attribute: 'format-year'
            },
            formatDayHeader: {
              attribute: 'format-day-header'
            },
            formatDayTitle: {
              attribute: 'format-day-title'
            },
            formatMonthTitle: {
              attribute: 'format-month-title'
            },
            yearRange: {
              attribute: 'year-range'
            },
            shortcutPropagation: {
              attribute: 'shortcut-propagation'
            },
            datepickerPopup: {
              attribute: 'datepicker-popup'
            },
            showButtonBar: {
              attribute: 'show-button-bar'
            },
            currentText: {
              attribute: 'current-text'
            },
            clearText: {
              attribute: 'clear-text'
            },
            closeText: {
              attribute: 'close-text'
            },
            closeOnDateSelection: {
              attribute: 'close-on-date-selection'
            },
            datepickerAppendToBody: {
              attribute: 'datepicker-append-to-body'
            },
            datepickerMode: {
              bound: 'datepicker-mode'
            },
            minDate: {
              bound: 'min-date'
            },
            maxDate: {
              bound: 'max-date'
            }
          },
          templateOptions: {
            dateOptions: {
              format: 'MM/dd/yyyy',
              initDate: new Date()
            }
          }
        },
        controller: [
          '$scope', function($scope) {
            $scope.datepicker = {};
            $scope.datepicker.opened = false;
            return $scope.datepicker.open = function($event) {
              return $scope.datepicker.opened = !$scope.datepicker.opened;
            };
          }
        ]
      });
      formlyConfigProvider.setType({
        name: 'typeahead',
        template: '<input type="text" ng-model="model[options.key]" uib-typeahead="item for item in to.options | filter:$viewValue" class="form-control">',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions: {
          ngModelAttrs: {
            ngModelOptions: {
              bound: 'ng-model-options'
            },
            typeaheadAppendTo: {
              bound: 'typeahead-append-to'
            },
            typeaheadAppendToBody: {
              bound: 'typeahead-append-to-body'
            },
            typeaheadEditable: {
              bound: 'typeahead-editable'
            },
            typeaheadFocusFirst: {
              bound: 'typeahead-focus-first'
            },
            typeaheadFocusOnSelect: {
              attribute: 'typeahead-focus-on-select'
            },
            typeaheadInputFormatter: {
              bound: 'typeahead-input-formatter'
            },
            typeaheadIsOpen: {
              bound: 'typeahead-is-open'
            },
            typeaheadLoading: {
              bound: 'typeahead-loading'
            },
            typeaheadMinLength: {
              bound: 'typeahead-min-length',
              value: 0
            },
            typeaheadNoResults: {
              bound: 'typeahead-no-results'
            },
            typeaheadShouldSelect: {
              bound: 'typeahead-should-select'
            },
            typeaheadOnSelect: {
              bound: 'typeahead-on-select'
            },
            typeaheadPopupTemplateUrl: {
              attribute: 'typeahead-popup-template-url'
            },
            typeaheadSelectOnBlur: {
              bound: 'typeahead-select-on-blur'
            },
            typeaheadSelectOnExact: {
              bound: 'typeahead-select-on-exact'
            },
            typeaheadShowHint: {
              bound: 'typeahead-show-hint'
            },
            typeaheadTemplateUrl: {
              attribute: 'typeahead-template-url'
            },
            typeaheadWaitMs: {
              bound: 'typeahead-wait-ms'
            }
          }
        }
      });
      formlyConfigProvider.setType({
        name: 'caption',
        template: '<div class="formly-form-caption" ng-bind-html="to.label"></div>',
        wrapper: ['bootstrapHasError']
      });
      formlyConfigProvider.setType({
        name: 'hidden',
        template: '<div class="formly-form-hidden"><input type="hidden" ng-model="model[options.key]"></div>'
      });
      formlyConfigProvider.setType({
        name: 'captcha',
        template: '<div class="formly-form-captcha"></div>'
      });
      return formlyConfigProvider;
    }
  ]);

  angular.module('trPcApp').config([
    '$routeProvider', 'APP_INFO', function($routeProvider, APP_INFO) {
      return $routeProvider.when('/dashboard', {
        templateUrl: APP_INFO.rootPath + 'html/view/dashboard.html',
        controller: 'DashboardViewCtrl'
      }).when('/enter-gifts', {
        templateUrl: APP_INFO.rootPath + 'html/view/enterGifts.html',
        controller: 'EnterGiftsViewCtrl'
      }).when('/email', {
        redirectTo: '/email/compose'
      }).when('/email/compose/:messageType?/:messageId?', {
        templateUrl: APP_INFO.rootPath + 'html/view/emailCompose.html',
        controller: 'EmailComposeViewCtrl'
      }).when('/email/message/:messageType', {
        redirectTo: '/email/message/:messageType/list'
      }).when('/email/message/:messageType/list', {
        templateUrl: APP_INFO.rootPath + 'html/view/emailMessageList.html',
        controller: 'EmailMessageListViewCtrl'
      }).when('/email/contacts', {
        redirectTo: '/email/contacts/email_rpt_show_all/list'
      }).when('/email/contacts/:filter', {
        redirectTo: '/email/contacts/:filter/list'
      }).when('/email/contacts/:filter/list', {
        templateUrl: APP_INFO.rootPath + 'html/view/emailContactsList.html',
        controller: 'EmailContactsListViewCtrl'
      }).when('/profile', {
        templateUrl: APP_INFO.rootPath + 'html/view/consProfile.html',
        controller: 'ConsProfileViewCtrl'
      }).when('/profile/questions', {
        templateUrl: APP_INFO.rootPath + 'html/view/surveyQuestions.html',
        controller: 'SurveyQuestionsViewCtrl'
      }).when('/profile/options', {
        templateUrl: APP_INFO.rootPath + 'html/view/eventOptions.html',
        controller: 'EventOptionsViewCtrl'
      }).otherwise({
        redirectTo: (function() {
          var $embedRoot, pcPage;
          $embedRoot = angular.element(document).find('[data-embed-root]');
          if ($embedRoot.data('pc-page') !== '') {
            pcPage = $embedRoot.data('pc-page');
          }
          if (pcPage === 'mtype') {
            return '/email/compose';
          } else {
            return '/dashboard';
          }
        })()
      });
    }
  ]);

  angular.module('trPcApp').run([
    '$rootScope', '$location', '$route', '$uibModal', '$window', 'AuthService', 'TeamraiserEventService', 'TeamraiserRegistrationService', 'SocialShareService', 'APP_INFO', function($rootScope, $location, $route, $uibModal, $window, AuthService, TeamraiserEventService, TeamraiserRegistrationService, SocialShareService, APP_INFO) {
      $rootScope.scrollToTop = function() {
        var $embedRoot;
        $embedRoot = angular.element(document).find('[data-embed-root]');
        if (angular.isElement($embedRoot)) {
          return $embedRoot[0].scrollIntoView();
        }
      };
      return $rootScope.$on('$routeChangeStart', function($event, next, current) {
        var redirectRoute, reloadRoute, showLoginModal;
        $rootScope.scrollToTop();
        redirectRoute = function(newRoute) {
          return $rootScope.$evalAsync(function() {
            return $location.path(newRoute);
          });
        };
        reloadRoute = function() {
          var ref;
          if ((ref = $location.path()) !== '' && ref !== next.originalPath) {
            return redirectRoute(next.originalPath);
          } else {
            return $route.reload();
          }
        };
        showLoginModal = function() {
          if (!$rootScope.loginModal) {
            return $rootScope.loginModal = $uibModal.open({
              scope: $rootScope,
              backdrop: 'static',
              templateUrl: APP_INFO.rootPath + 'html/modal/login.html'
            });
          }
        };
        if (!$rootScope.teamraiserConfig) {
          $event.preventDefault();
          return TeamraiserEventService.getConfig().then(function() {
            if ($rootScope.teamraiserConfig === -1) {

            } else {
              return reloadRoute();
            }
          });
        } else if ($rootScope.teamraiserConfig === -1) {
          return $event.preventDefault();
        } else if ($rootScope.teamraiserConfig.acceptingDonations !== 'true' && $rootScope.teamraiserConfig.acceptingRegistrations !== 'true') {
          return $event.preventDefault();
        } else if (!$rootScope.consId) {
          $event.preventDefault();
          return AuthService.getLoginState().then(function() {
            if ($rootScope.consId === -1) {
              return showLoginModal();
            } else {
              return $route.reload();
            }
          });
        } else if ($rootScope.consId === -1) {
          $event.preventDefault();
          return showLoginModal();
        } else if (!$rootScope.authToken) {
          $event.preventDefault();
          return AuthService.getAuthToken().then(function() {
            return reloadRoute();
          });
        } else if (!$rootScope.participantRegistration) {
          $event.preventDefault();
          return TeamraiserRegistrationService.getRegistration().then(function() {
            if ($rootScope.participantRegistration === -1) {

            } else {
              return reloadRoute();
            }
          });
        } else if ($rootScope.participantRegistration === -1) {
          return $event.preventDefault();
        } else if (!$rootScope.eventInfo) {
          $event.preventDefault();
          return TeamraiserEventService.getTeamraiser().then(function(response) {
            if ($rootScope.eventInfo === -1) {

            } else {
              return reloadRoute();
            }
          });
        } else if ($rootScope.eventInfo === -1) {
          return $event.preventDefault();
        } else if (!$rootScope.socialSettings.janrainInitialized) {
          $event.preventDefault();
          return SocialShareService.initJanrain().then(function() {
            return reloadRoute();
          });
        } else if (next.originalPath === '/profile/questions' && $rootScope.teamraiserConfig.personalSurveyEditAllowed !== 'true') {
          return redirectRoute('/profile');
        }
      });
    }
  ]);

  angular.module('trPcApp').config([
    '$translateProvider', 'APP_INFO', function($translateProvider, APP_INFO) {
      var loginMessages, overrideMessages, trpcMessages;
      $translateProvider.fallbackLanguage('en_US');
      $translateProvider.useSanitizeValueStrategy('escape');
      loginMessages = {
        type: 'msgCat',
        bundle: 'login_user',
        keys: ['error_invalid_username_or_password', 'login_button_label', 'new_password', 'new_password_repeat', 'password_hint', 'reset_password_title', 'submit_button_label']
      };
      trpcMessages = {
        type: 'msgCat',
        bundle: 'trpc',
        keys: ['activity_followup_message_sent', 'add_contact_email_label', 'add_contact_first_name_label', 'add_contact_last_name_label', 'add_contact_submit_button', 'add_contacts_cancel_link', 'addressbookimport_header', 'addressbookimport_importcandidatecontacts_list_select_all_label_top', 'addressbookimport_importcandidatecontacts_list_select_label_top', 'addressbookimport_importcandidatecontacts_list_select_none_label_top', 'addressbookimport_selectcontacts_info', 'addressbookimport_selectcontacts_none_selected_failure', 'addressbookimport_selectsource_info_1', 'addressbookimport_thirdpartystatus_info', 'addressbookimport_tooltip_select_source_generic', 'addressbookimport_tooltip_select_source_gmail', 'addressbookimport_tooltip_select_source_yahoo', 'admin_newsfeed_header_h1', 'captains_message_edit_link', 'captains_message_empty', 'captains_message_header', 'captains_message_save_button', 'captains_save_failure', 'captains_save_success', 'chart_emails_sent_label', 'chart_gift_amount_label', 'class_cancel_link', 'class_next_button', 'class_or_label', 'company_page_content_label', 'company_page_shortcut_cancel', 'company_page_shortcut_edit', 'company_page_shortcut_edit2', 'company_page_shortcut_save', 'company_page_shortcut_save_failure', 'company_page_shortcut_save_success', 'company_progress_bar_title', 'company_report_teams_label', 'company_select_none', 'compose_current_layout_label', 'compose_delete_button_label', 'compose_message_label', 'compose_preview_button_label', 'compose_preview_send_label', 'compose_salutation_hint', 'compose_save_template_button_label', 'compose_send_button_label', 'compose_subject_label', 'compose_to_label', 'contact_add_failure_email', 'contact_add_failure_unknown', 'contact_add_success', 'contact_details_contact_info_hdr', 'contact_details_edit_info', 'contact_edit_address1_label', 'contact_edit_address2_label', 'contact_edit_cancel_link', 'contact_edit_city_label', 'contact_edit_country_label', 'contact_edit_email_label', 'contact_edit_first_name_label', 'contact_edit_last_name_label', 'contact_edit_save_button', 'contact_edit_state_label', 'contact_edit_zip_label', 'contact_no_name_label', 'contacts_acknowledge_contact_gift_no_email_body', 'contacts_acknowledge_gift_title_label', 'contacts_add_to_group', 'contacts_add_to_group_button', 'contacts_confirm_delete_body', 'contacts_confirm_delete_groups_body', 'contacts_confirm_delete_groups_header', 'contacts_confirm_delete_header', 'contacts_create_a_new_group', 'contacts_delete_button', 'contacts_delete_success', 'contacts_donations_label', 'contacts_email_all_button', 'contacts_email_opened_label', 'contacts_groups_all', 'contacts_import_contacts', 'contacts_label', 'contacts_page_visits_label', 'contacts_previous_amount_label', 'contacts_select_label', 'contacts_selected', 'contacts_sidebar_add_contact_header', 'contacts_warn_delete_failure_body', 'csv_upload_contacts', 'dashboard_company_cancel_label', 'dashboard_company_edit_label', 'dashboard_company_name_title', 'dashboard_company_null_label', 'dashboard_company_submit_label', 'dashboard_edit_company_list_label', 'dashboard_edit_company_name_label', 'dashboard_enter_gift_button', 'data_table_contacts_per_page', 'dialog_acknowledge_label', 'dialog_delete_label', 'dialog_save_label', 'donations_heading', 'donations_no_donations_found', 'drafts_confirm_delete_body', 'drafts_confirm_delete_header', 'drafts_drafts_label', 'drafts_no_drafts_found', 'email_compose_use_template_label', 'email_template_radio_custom_label', 'email_template_radio_other_label', 'email_template_radio_recruit_label', 'email_template_radio_solicit_label', 'email_template_radio_thanks_label', 'filter_email_rpt_show_donors', 'filter_email_rpt_show_ly_donors', 'filter_email_rpt_show_lybunt_donors', 'filter_email_rpt_show_ly_teammates', 'filter_email_rpt_show_ly_unreg_teammates', 'filter_email_rpt_show_never_emailed', 'filter_email_rpt_show_nondonors', 'filter_email_rpt_show_nondonors_followup', 'filter_email_rpt_show_nonteammates', 'filter_email_rpt_show_teammates', 'filter_email_rpt_show_unthanked_donors', 'gift_add_another_button_label', 'gift_add_button_label', 'gift_addl_options_label', 'gift_amount_label', 'gift_billing_city_label', 'gift_billing_first_name_label', 'gift_billing_last_name_label', 'gift_billing_state_label', 'gift_billing_street1_label', 'gift_billing_street2_label', 'gift_billing_zip_label', 'gift_check_number_label', 'gift_city_label', 'gift_confirm_delete_body', 'gift_confirm_delete_header', 'gift_credit_card_number_label', 'gift_credit_expiration_date_label', 'gift_credit_verification_code_label', 'gift_display_personal_page_label', 'gift_email_label', 'gift_first_name_label', 'gift_gift_category_label', 'gift_last_name_label', 'gift_payment_type_cash', 'gift_payment_type_check', 'gift_payment_type_credit', 'gift_payment_type_label', 'gift_payment_type_later', 'gift_recongition_name_label', 'gift_state_label', 'gift_street1_label', 'gift_street2_label', 'gift_submit_success', 'gift_zip_label', 'goal_edit_goal', 'goal_goal', 'hdr_profile_link', 'manage_membership_captain_first_name', 'manage_membership_captain_last_name', 'manage_membership_continue_button', 'manage_membership_find_team', 'manage_membership_join_team', 'manage_membership_join_team_password_label', 'manage_membership_join_team_radio_text', 'manage_membership_label', 'manage_membership_leave_team_explanation_text', 'manage_membership_leave_team_radio_text', 'manage_membership_search_button', 'manage_membership_search_failure', 'manage_membership_search_result_captain_label', 'manage_membership_search_result_company_label', 'manage_membership_search_results', 'manage_membership_team_company', 'manage_membership_team_name', 'manage_membership_team_search_results_count', 'manage_membership_team_search_results_found', 'manage_membership_team_search_results_hint', 'manage_team_captains_header', 'message_send_success', 'message_template_save_success', 'nav_manage_privacy_settings_link', 'nav_messaging', 'nav_overview', 'nav_public_page', 'nav_team_page', 'personal_page_privacy_prefix_desc', 'personal_page_privacy_private_desc', 'personal_page_privacy_private_label', 'personal_page_privacy_public_desc', 'personal_page_privacy_public_label', 'personal_page_privacy_save_success', 'personal_page_save', 'personal_page_shortcut_edit', 'personal_page_shortcut_save', 'personal_preview_close_label', 'privacy_settings_anonymous_option', 'privacy_settings_radio_label', 'privacy_settings_screenname_option', 'privacy_settings_standard_option', 'progress_bar_title', 'progress_team_progress', 'recent_activity_header', 'report_personal_donations_download', 'sent_message_date_label', 'sent_message_forward_label', 'sent_message_subject_label', 'sent_message_to_label', 'sent_no_sent_messages_found', 'sent_sent_message_label', 'sent_sent_messages_label', 'session_timeout_log_back_in', 'shortcut_save_failure', 'shortcut_save_success', 'social_share_link_text', 'subnav_edit_survey_responses', 'subnav_manage_captains', 'survey_save_failure', 'survey_save_responses_button', 'survey_save_success', 'team_donations_heading', 'team_edit_team_name_label', 'team_goal_edit_goal', 'team_goal_goal', 'team_page_permalink', 'team_page_shortcut_cancel', 'team_page_shortcut_edit', 'team_page_shortcut_edit2', 'team_page_shortcut_save', 'team_password_edit_label', 'team_report_team_donations_download', 'team_report_team_members_download', 'team_roster_heading', 'teampage_shortcut_save_failure', 'teampage_shortcut_save_success', 'what_next_add_contacts_header', 'what_next_followup_header', 'what_next_question', 'what_next_reach_out_header', 'what_next_send_email_header', 'what_next_send_thanks_header', 'what_next_set_goal_header', 'what_next_setup_your_personal_page_header']
      };
      overrideMessages = {
        type: 'file',
        prefix: APP_INFO.rootPath + 'translation/',
        suffix: '.json'
      };
      return $translateProvider.useLoader('useMessageCatalog', {
        messages: [loginMessages, trpcMessages, overrideMessages]
      });
    }
  ]);

  angular.module('trPcApp').config([
    '$uibModalProvider', function($uibModalProvider) {
      return angular.extend($uibModalProvider.options, {
        windowClass: 'ng-pc-modal'
      });
    }
  ]);

  angular.module('trPcApp').factory('AuthService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        getLoginState: function() {
          return LuminateRESTService.consRequest('method=loginTest').then(function(response) {
            var ref;
            $rootScope.consId = ((ref = response.data.loginResponse) != null ? ref.cons_id : void 0) || -1;
            return response;
          });
        },
        getAuthToken: function() {
          return LuminateRESTService.consRequest('method=getLoginUrl').then(function(response) {
            $rootScope.authToken = response.data.getLoginUrlResponse.token;
            return response;
          });
        },
        login: function(requestData) {
          var dataString;
          dataString = 'method=login';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.consRequest(dataString).then(function(response) {
            var ref;
            $rootScope.consId = ((ref = response.data.loginResponse) != null ? ref.cons_id : void 0) || -1;
            delete $rootScope.authToken;
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('ConstituentService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getUser: function() {
          return LuminateRESTService.consRequest('method=getUser', true).then(function(response) {
            return response;
          });
        },
        listUserFields: function(requestData) {
          var dataString;
          dataString = 'method=listUserFields';
          dataString += '&include_choices=true';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.consRequest(dataString).then(function(response) {
            return response;
          });
        },
        listUserFieldChoices: function(requestData) {
          var dataString;
          dataString = 'method=listUserFieldChoices&field=';
          if (requestData && requestData !== '') {
            dataString += requestData;
          }
          return LuminateRESTService.consRequest(dataString).then(function(response) {
            return response;
          });
        },
        update: function(requestData) {
          var dataString;
          dataString = 'method=update';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.consRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        changePassword: function(requestData) {
          var dataString;
          dataString = 'method=changePassword';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.consRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        logSocialShare: function(requestData) {
          var dataString;
          dataString = 'method=logSocialShare';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.consRequest(dataString, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('ContactService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        addAddressBookContact: function(requestData) {
          var dataString;
          dataString = 'method=addAddressBookContact';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        getAddressBookImportJobStatus: function(requestData) {
          var dataString;
          dataString = 'method=getAddressBookImportJobStatus';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getAddressBookImportContacts: function(requestData) {
          var dataString;
          dataString = 'method=getAddressBookImportContacts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        importAddressBookContacts: function(requestData) {
          var dataString;
          dataString = 'method=importAddressBookContacts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        addAddressBookGroup: function(requestData) {
          var dataString;
          dataString = 'method=addAddressBookGroup';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        addContactsToGroup: function(requestData) {
          var dataString;
          dataString = 'method=addContactsToGroup';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        deleteAddressBookGroups: function(requestData) {
          var dataString;
          dataString = 'method=deleteAddressBookGroups';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        deleteTeamraiserAddressBookContacts: function(requestData) {
          var dataString;
          dataString = 'method=deleteTeamraiserAddressBookContacts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        updateTeamraiserAddressBookContact: function(requestData) {
          var dataString;
          dataString = 'method=updateTeamraiserAddressBookContact';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getAddressBookGroups: function(requestData) {
          var dataString;
          dataString = 'method=getAddressBookGroups';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.addressBookRequest(dataString, true).then(function(response) {
            return response;
          });
        },
        getTeamraiserAddressBookFilters: function(requestData) {
          var dataString;
          dataString = 'method=getTeamraiserAddressBookFilters';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getTeamraiserAddressBookContacts: function(requestData) {
          var dataString;
          dataString = 'method=getTeamraiserAddressBookContacts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getTeamraiserAddressBookContact: function(requestData) {
          var dataString;
          dataString = 'method=getTeamraiserAddressBookContact';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getTeamraiserAddressBookGroupContacts: function(requestData) {
          var dataString;
          dataString = 'method=getTeamraiserAddressBookGroupContacts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getContactString: function(contact) {
          var contactData;
          contactData = '';
          if (contact.firstName) {
            contactData += contact.firstName;
          }
          if (contact.lastName) {
            if (contactData !== '') {
              contactData += ' ';
            }
            contactData += contact.lastName;
          }
          if (contact.email) {
            if (contactData !== '') {
              contactData += ' ';
            }
            contactData += '<' + contact.email + '>';
          }
          return contactData;
        },
        resetSelectedContacts: function() {
          return $rootScope.selectedContacts = {
            contacts: []
          };
        },
        getNumSelectedContacts: function() {
          var ref;
          if (!((ref = $rootScope.selectedContacts) != null ? ref.contacts : void 0)) {
            this.resetSelectedContacts();
          }
          return $rootScope.selectedContacts.contacts.length;
        },
        isInSelectedContacts: function(testContact) {
          var found;
          found = false;
          if ((testContact != null) && (testContact.id != null)) {
            angular.forEach($rootScope.selectedContacts.contacts, function(contact) {
              if ((contact != null) && contact.id === testContact.id) {
                return found = true;
              }
            });
          }
          return found;
        },
        addToSelectedContacts: function(addContact) {
          if (!this.isInSelectedContacts(addContact)) {
            $rootScope.selectedContacts.contacts.push(addContact);
          }
          return addContact;
        },
        removeFromSelectedContacts: function(removeContact) {
          var ind;
          ind = -1;
          if ((removeContact != null) && (removeContact.id != null)) {
            angular.forEach($rootScope.selectedContacts.contacts, function(contact, key) {
              if ((contact != null) && contact.id === removeContact.id) {
                return ind = key;
              }
            });
            if (ind >= 0) {
              $rootScope.selectedContacts.contacts.splice(ind, 1);
            }
          }
          return removeContact;
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('ContentService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getMessageBundle: function(requestData) {
          var dataString;
          dataString = 'method=getMessageBundle';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.contentRequest(dataString, false).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('useMessageCatalog', [
    '$q', '$http', 'ContentService', function($q, $http, ContentService) {
      return function(options) {
        var deferred, j, len, loadFile, loadMsgCat, message, promises, ref;
        deferred = $q.defer();
        loadFile = function(file) {
          if (!file || !angular.isString(file.prefix || !angular.isString(file.suffix))) {
            throw new Error("Couldn't load static file, no prefix or suffix specified");
          }
          return $http(angular.extend({
            url: [file.prefix, options.key, file.suffix].join(''),
            method: 'GET',
            params: ''
          }, options.$http)).then(function(result) {
            return result.data;
          }, function() {
            return $q.reject(options.key);
          });
        };
        loadMsgCat = function(data) {
          var dataStr, ref;
          if (!(data != null ? data.keys : void 0) || !angular.isArray(data.keys)) {
            throw new Error("Couldn't load message catalog bundle, no keys specified");
          }
          dataStr = 'bundle=';
          if (data != null ? data.bundle : void 0) {
            dataStr += data.bundle;
          } else {
            dataStr += 'trpc';
          }
          if ((data != null ? data.keys : void 0) && angular.isArray(data.keys)) {
            dataStr += '&keys=' + (data != null ? (ref = data.keys) != null ? ref.toString() : void 0 : void 0);
          }
          return ContentService.getMessageBundle(dataStr).then(function(response) {
            var j, len, messageBundle, messageValues, msg, ref1, ref2, stripHtml;
            messageBundle = {};
            stripHtml = function(text) {
              if (!!text) {
                return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/gm, ' ');
              }
            };
            if (response != null ? (ref1 = response.data) != null ? (ref2 = ref1.getMessageBundleResponse) != null ? ref2.values : void 0 : void 0 : void 0) {
              messageValues = response.data.getMessageBundleResponse.values;
              if (!angular.isArray(messageValues)) {
                messageValues = [messageValues];
              }
              for (j = 0, len = messageValues.length; j < len; j++) {
                msg = messageValues[j];
                messageBundle[msg.key] = stripHtml(msg.value);
              }
            }
            return messageBundle;
          });
        };
        if ((options != null ? options.messages : void 0) && angular.isArray(options.messages)) {
          promises = [];
          ref = options.messages;
          for (j = 0, len = ref.length; j < len; j++) {
            message = ref[j];
            switch (message.type) {
              case 'file':
                promises.push(loadFile(message));
                break;
              case 'msgCat':
                promises.push(loadMsgCat(message));
                break;
              default:
                throw new Error("Unrecognized message.type: " + message.type);
            }
          }
          $q.all(promises).then(function(data) {
            var k, len1, mergeData, resp;
            mergeData = {};
            for (k = 0, len1 = data.length; k < len1; k++) {
              resp = data[k];
              angular.extend(mergeData, resp);
            }
            return deferred.resolve(mergeData);
          });
        } else {
          throw new Error("Couldn't load messages using message catalog, no messages provided.");
          deferred.reject(options.key);
        }
        return deferred.promise;
      };
    }
  ]);

  angular.module('trPcApp').factory('LocaleService', [
    '$rootScope', '$translate', 'LuminateRESTService', function($rootScope, $translate, LuminateRESTService) {
      return {
        listSupportedLocales: function() {
          return LuminateRESTService.contentRequest('method=listSupportedLocales', true, true).then(function(response) {
            return response;
          });
        },
        setLocale: function(locale) {
          $rootScope.locale = locale;
          return $translate.use(locale);
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('LuminateRESTService', [
    '$rootScope', '$q', '$http', '$timeout', '$uibModal', 'APP_INFO', function($rootScope, $q, $http, $timeout, $uibModal, APP_INFO) {
      return {
        request: function(apiServlet, requestData, includeAuth, includeFrId) {
          var $embedRoot;
          if (!requestData) {
            return new Error('Angular TeamRaiser Participant Center: API request for ' + apiServlet + ' with no requestData');
          } else {
            if (!$rootScope.apiKey) {
              $embedRoot = angular.element(document).find('[data-embed-root]');
              if ($embedRoot.data('api-key') !== '') {
                $rootScope.apiKey = $embedRoot.data('api-key');
              }
              if (!$rootScope.apiKey) {
                new Error('Angular TeamRaiser Participant Center: No Luminate Online API Key is defined.');
                return $timeout(this.request, 500, true, apiServlet, requestData, includeAuth, includeFrId);
              } else {
                return this.request(apiServlet, requestData, includeAuth, includeFrId);
              }
            } else {
              requestData += '&v=1.0&api_key=' + $rootScope.apiKey + '&response_format=json&suppress_response_codes=true&ng_tr_pc_v=' + APP_INFO.version;
              if (includeAuth && !$rootScope.authToken) {
                return new Error('Angular TeamRaiser Participant Center: No Luminate Online auth token is defined.');
              } else {
                if (includeAuth) {
                  requestData += '&auth=' + $rootScope.authToken;
                }
                if (includeFrId) {
                  requestData += '&fr_id=' + $rootScope.frId + '&s_trID=' + $rootScope.frId;
                }
                if ($rootScope.locale) {
                  requestData += '&s_locale=' + $rootScope.locale;
                }
                return $http({
                  method: 'POST',
                  url: apiServlet,
                  data: requestData,
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  }
                }).then(function(response) {
                  if (response.data.errorResponse && ['3', '5', '14', '2604'].indexOf(response.data.errorResponse.code) !== -1) {
                    if (!$rootScope.loginModal) {
                      $rootScope.loginModal = $uibModal.open({
                        scope: $rootScope,
                        backdrop: 'static',
                        templateUrl: APP_INFO.rootPath + 'html/modal/login.html'
                      });
                    }
                    return $q.reject();
                  } else {
                    return response;
                  }
                });
              }
            }
          }
        },
        addressBookRequest: function(requestData, includeAuth) {
          return this.request('CRAddressBookAPI', requestData, includeAuth, false);
        },
        consRequest: function(requestData, includeAuth) {
          return this.request('CRConsAPI', requestData, includeAuth, false);
        },
        contentRequest: function(requestData, includeAuth) {
          return this.request('CRContentAPI', requestData, includeAuth, false);
        },
        teamraiserRequest: function(requestData, includeAuth, includeFrId) {
          return this.request('CRTeamraiserAPI', requestData, includeAuth, includeFrId);
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('PageBuilderService', [
    '$rootScope', '$http', '$q', '$timeout', '$document', function($rootScope, $http, $q, $timeout, $document) {
      return {
        getPageContent: function(pbPageName, useCache, additionalArguments) {
          var dataString, deferred;
          if (!$rootScope.pageBuilderCache) {
            $rootScope.pageBuilderCache = {};
          }
          if (useCache && $rootScope.pageBuilderCache[pbPageName]) {
            deferred = $q.defer();
            deferred.resolve($rootScope.pageBuilderCache[pbPageName]);
            return deferred.promise;
          } else {
            dataString = 'pagename=getPageBuilderPageContent&pgwrap=n';
            if (pbPageName) {
              dataString += '&pb_page_name=' + pbPageName;
            }
            if (additionalArguments) {
              dataString += '&' + additionalArguments;
            }
            return $http({
              method: 'GET',
              url: 'SPageServer?' + dataString,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            }).then(function(response) {
              if (pbPageName) {
                $rootScope.pageBuilderCache[pbPageName] = response;
                return response;
              }
            });
          }
        },
        loadScript: function(url) {
          var deferred, document, scriptTag;
          deferred = $q.defer();
          document = $document[0];
          scriptTag = document.createElement('script');
          scriptTag.src = url;
          scriptTag.type = 'text/javascript';
          scriptTag.onload = function(e) {
            return $timeout(function() {
              return deferred.resolve(e);
            });
          };
          scriptTag.onreadystatechange = function(e) {
            if (this.readyState) {
              if (this.readyState === 'complete' || this.readyState === 'loaded') {
                return $timeout(function() {
                  return deferred.resolve(e);
                });
              }
            }
          };
          scriptTag.onerror = function(e) {
            return $timeout(function() {
              return deferred.reject(e);
            });
          };
          document.body.appendChild(scriptTag);
          return deferred.promise;
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('SocialShareService', [
    '$rootScope', '$cookies', '$window', 'ConstituentService', 'PageBuilderService', 'TeamraiserEventService', function($rootScope, $cookies, $window, ConstituentService, PageBuilderService, TeamraiserEventService) {
      return {
        logShare: function(userId, provider) {
          var params;
          params = '';
          params += 'social_uid=' + encodeURIComponent(userId);
          params += '&social_site=' + provider;
          params += '&share_url=' + encodeURIComponent($window.location.href);
          params += '&share_id=' + encodeURIComponent($rootScope.socialSettings.shareId);
          return ConstituentService.logSocialShare(params).then(function(response) {
            return response;
          });
        },
        activateJanrain: function(elem, sharePage) {
          var shareInstance;
          if ($rootScope.socialSettings.janrainEnabled && ($window.janrain != null) && (elem != null ? elem.length : void 0)) {
            shareInstance = {
              message: $rootScope.socialSettings.shareMessage,
              url: sharePage || ''
            };
            $window.janrain.social.addWidgetTo(elem[0], shareInstance);
            return $window.janrain;
          }
        },
        initJanrain: function() {
          var error, error1, janrainAppName, ref, ref1;
          janrainAppName = $cookies.get('janrainEngageAppName');
          $rootScope.socialSettings.appName = janrainAppName || $rootScope.socialSettings.appName;
          $rootScope.socialSettings.appUrl = "https://" + $rootScope.socialSettings.appName + ".rpxnow.com";
          try {
            $rootScope.socialSettings.providers = JSON.parse(atob($cookies.get('janrainShareProviders')));
          } catch (error1) {
            error = error1;
            console.log("janrainShareProviders cookie error: " + error);
            $rootScope.socialSettings.providers = ["native-facebook", "native-googleplus", "native-pinterest", "native-reddit", "native-tumblr", "native-twitter"];
          }
          if (((ref = $window.janrain) != null ? ref.settings : void 0) == null) {
            $window.janrain = {
              settings: {}
            };
          }
          $window.janrain.settings.appUrl = $rootScope.socialSettings.appUrl;
          $window.janrain.settings.social = {
            shareCountMode: 'none',
            orientation: 'horizontal',
            providers: $rootScope.socialSettings.providers
          };
          $window.janrain.logShare = function(userId, provider) {
            var params;
            params = '';
            params += 'social_uid=' + encodeURIComponent(userId);
            params += '&social_site=' + provider;
            params += '&share_url=' + encodeURIComponent($window.location.href);
            params += '&share_id=' + encodeURIComponent($rootScope.socialSettings.shareId);
            return ConstituentService.logSocialShare(params).then(function(response) {
              return response;
            });
          };
          if (((ref1 = $window.janrain) != null ? ref1.social : void 0) == null) {
            return PageBuilderService.loadScript('//cdn-social.janrain.com/social/janrain-social.min.js').then(function(response) {
              return TeamraiserEventService.getParticipantCenterWrapper().then(function(response) {
                var ref2, ref3, wrapper;
                if ((response != null ? (ref2 = response.data) != null ? (ref3 = ref2.getParticipantCenterWrapperResponse) != null ? ref3.wrapper : void 0 : void 0 : void 0) != null) {
                  wrapper = response.data.getParticipantCenterWrapperResponse.wrapper;
                  $rootScope.socialSettings.janrainEnabled = wrapper.isJanrainEnabled;
                  $rootScope.socialSettings.shareTitle = wrapper.shareTitle;
                  $rootScope.socialSettings.shareAction = wrapper.shareAction;
                  $rootScope.socialSettings.shareMessage = wrapper.shareMessage;
                  if (!(wrapper.shareId == null)) {
                    $rootScope.socialSettings.shareId = wrapper.shareId;
                  }
                }
                $window.janrain.social.on("share_done", function(data) {
                  window.janrain.logShare(data.auth_token, data.provider);
                  return data;
                });
                $rootScope.socialSettings.janrainInitialized = true;
                return response;
              });
            });
          } else {
            return TeamraiserEventService.getParticipantCenterWrapper().then(function(response) {
              var ref2, ref3, wrapper;
              if ((response != null ? (ref2 = response.data) != null ? (ref3 = ref2.getParticipantCenterWrapperResponse) != null ? ref3.wrapper : void 0 : void 0 : void 0) != null) {
                wrapper = response.data.getParticipantCenterWrapperResponse.wrapper;
                $rootScope.socialSettings.janrainEnabled = wrapper.isJanrainEnabled;
                $rootScope.socialSettings.shareTitle = wrapper.shareTitle;
                $rootScope.socialSettings.shareAction = wrapper.shareAction;
                $rootScope.socialSettings.shareMessage = wrapper.shareMessage;
                if (!(wrapper.shareId == null)) {
                  $rootScope.socialSettings.shareId = wrapper.shareId;
                }
              }
              $window.janrain.social.on("share_done", function(data) {
                window.janrain.logShare(data.auth_token, data.provider);
                return data;
              });
              $rootScope.socialSettings.janrainInitialized = true;
              return response;
            });
          }
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserCompanyService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getCompanyList: function() {
          return LuminateRESTService.teamraiserRequest('method=getCompanyList', true, true).then(function(response) {
            return response;
          });
        },
        getCompanies: function(requestData) {
          var dataString;
          dataString = 'method=getCompaniesByInfo';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, false, true).then(function(response) {
            return response;
          });
        },
        getCompany: function() {
          var ref, ref1;
          return this.getCompanies('company_id=' + ((ref = $rootScope.participantRegistration) != null ? (ref1 = ref.companyInformation) != null ? ref1.companyId : void 0 : void 0)).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserEmailService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        addDraft: function(requestData) {
          var dataString;
          dataString = 'method=addDraft';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        updateDraft: function(requestData) {
          var dataString;
          dataString = 'method=updateDraft';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        deleteDraft: function(requestData) {
          var dataString;
          dataString = 'method=deleteDraft';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getDrafts: function(requestData) {
          var dataString;
          dataString = 'method=getDrafts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getDraft: function(requestData) {
          var dataString;
          dataString = 'method=getDraft';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        deleteSentMessage: function(requestData) {
          var dataString;
          dataString = 'method=deleteSentMessage';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getSentMessages: function(requestData) {
          var dataString;
          dataString = 'method=getSentMessages';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getSentMessage: function(requestData) {
          var dataString;
          dataString = 'method=getSentMessage';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getMessageLayouts: function() {
          return LuminateRESTService.teamraiserRequest('method=getMessageLayouts', true, true).then(function(response) {
            return response;
          });
        },
        getSuggestedMessages: function() {
          return LuminateRESTService.teamraiserRequest('method=getSuggestedMessages', true, true).then(function(response) {
            return response;
          });
        },
        getSuggestedMessage: function(requestData) {
          var dataString;
          dataString = 'method=getSuggestedMessage';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        previewMessage: function(requestData) {
          var dataString;
          dataString = 'method=previewMessage';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        sendMessage: function(requestData) {
          var dataString;
          dataString = 'method=sendTafMessage';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserEventService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        getConfig: function() {
          return LuminateRESTService.teamraiserRequest('method=getTeamraiserConfig', false, true).then(function(response) {
            var teamraiserConfig;
            teamraiserConfig = response.data.getTeamraiserConfigResponse.teamraiserConfig;
            if (!teamraiserConfig) {
              $rootScope.teamraiserConfig = -1;
            } else {
              $rootScope.teamraiserConfig = teamraiserConfig;
            }
            return response;
          });
        },
        getTeamraisers: function(requestData) {
          var dataString;
          dataString = 'method=getTeamraisersByInfo';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, false, false).then(function(response) {
            return response;
          });
        },
        getTeamraiser: function() {
          return this.getTeamraisers('list_filter_column=frc.fr_id&list_filter_text=' + $rootScope.frId + '&name=' + encodeURIComponent('%')).then(function(response) {
            var donate_event_url, ref, teamraiser;
            teamraiser = (ref = response.data.getTeamraisersResponse) != null ? ref.teamraiser : void 0;
            if (!teamraiser) {
              $rootScope.eventInfo = -1;
            } else {
              donate_event_url = teamraiser.donate_event_url;
              if (donate_event_url && donate_event_url.indexOf('df_id=') !== -1) {
                teamraiser.donationFormId = donate_event_url.split('df_id=')[1].split('&')[0];
              }
              $rootScope.eventInfo = teamraiser;
            }
            return response;
          });
        },
        getEventDataParameter: function(requestData) {
          var dataString;
          dataString = 'method=getEventDataParameter';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, false, true).then(function(response) {
            return response;
          });
        },
        getParticipationType: function(requestData) {
          var dataString;
          dataString = 'method=getParticipationType';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, false, true).then(function(response) {
            return response;
          });
        },
        getParticipantCenterWrapper: function() {
          return LuminateRESTService.teamraiserRequest('method=getParticipantCenterWrapper', false, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserGiftService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getGiftCategories: function() {
          return LuminateRESTService.teamraiserRequest('method=getGiftCategories', true, true).then(function(response) {
            return response;
          });
        },
        addGift: function(requestData) {
          var dataString;
          dataString = 'method=addGift';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        deleteGift: function(requestData) {
          var dataString;
          dataString = 'method=deleteGift';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        acknowledgeGift: function(requestData) {
          var dataString;
          dataString = 'method=acknowledgeGifts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getGift: function(requestData) {
          var dataString;
          dataString = 'method=getGift';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getGifts: function(requestData) {
          var dataString;
          dataString = 'method=getGifts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getTeamGifts: function(requestData) {
          var dataString;
          dataString = 'method=getTeamGifts';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserNewsFeedService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getNewsFeeds: function(requestData) {
          var dataString;
          dataString = 'method=getNewsFeeds';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserParticipantService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        getParticipants: function(requestData) {
          var dataString;
          dataString = 'method=getParticipants';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, false, true).then(function(response) {
            return response;
          });
        },
        getParticipant: function() {
          return this.getParticipants('first_name=' + encodeURIComponent('%%%') + '&list_filter_column=reg.cons_id&list_filter_text=' + $rootScope.consId);
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserProgressService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getProgress: function() {
          return LuminateRESTService.teamraiserRequest('method=getParticipantProgress', false, true).then(function(response) {
            return response;
          });
        },
        getWhatNext: function() {
          return LuminateRESTService.teamraiserRequest('method=getTeamraiserSuggestion&show_all_suggestions=true', false, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserRecentActivityService', [
    'LuminateRESTService', function(LuminateRESTService) {
      return {
        getRecentActivity: function() {
          return LuminateRESTService.teamraiserRequest('method=getRecentActivity', true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserRegistrationService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        getRegistration: function() {
          return LuminateRESTService.teamraiserRequest('method=getRegistration', true, true).then(function(response) {
            var participantRegistration, ref;
            participantRegistration = (ref = response.data.getRegistrationResponse) != null ? ref.registration : void 0;
            if (!participantRegistration) {
              $rootScope.participantRegistration = -1;
            } else {
              $rootScope.participantRegistration = participantRegistration;
            }
            return response;
          });
        },
        updateRegistration: function(requestData) {
          var dataString;
          dataString = 'method=updateRegistration';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        updatePersonalPagePrivacy: function(requestData) {
          var dataString;
          dataString = 'method=updatePersonalPagePrivacy';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserShortcutURLService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        updateShortcut: function(requestData) {
          var dataString;
          dataString = 'method=updateShortcut';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getShortcut: function() {
          return LuminateRESTService.teamraiserRequest('method=getShortcut', true, true).then(function(response) {
            return response;
          });
        },
        updateTeamShortcut: function(requestData) {
          var dataString;
          dataString = 'method=updateTeamShortcut';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getTeamShortcut: function() {
          return LuminateRESTService.teamraiserRequest('method=getTeamShortcut', true, true).then(function(response) {
            return response;
          });
        },
        updateCompanyShortcut: function(requestData) {
          var dataString;
          dataString = 'method=updateCompanyShortcut&company_id=' + $rootScope.participantRegistration.companyInformation.companyId;
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getCompanyShortcut: function() {
          var dataString;
          dataString = 'method=getCompanyShortcut&company_id=' + $rootScope.participantRegistration.companyInformation.companyId;
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserSurveyResponseService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        getSurveyResponses: function(requestData) {
          var dataString;
          dataString = 'method=getSurveyResponses';
          dataString += '&use_filters=true';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        updateSurveyResponses: function(requestData) {
          var dataString;
          dataString = 'method=updateSurveyResponses';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcApp').factory('TeamraiserTeamService', [
    '$rootScope', 'LuminateRESTService', function($rootScope, LuminateRESTService) {
      return {
        getTeams: function(requestData) {
          var dataString;
          dataString = 'method=getTeamsByInfo';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, false, true).then(function(response) {
            return response;
          });
        },
        getTeam: function() {
          return this.getTeams('team_id=' + $rootScope.participantRegistration.teamId);
        },
        getTeamRoster: function(requestData) {
          var dataString;
          dataString = 'method=getTeamRoster&team_id=' + $rootScope.participantRegistration.teamId;
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        joinTeam: function(requestData) {
          var dataString;
          dataString = 'method=joinTeam';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        leaveTeam: function() {
          return LuminateRESTService.teamraiserRequest('method=leaveTeam', true, true).then(function(response) {
            return response;
          });
        },
        updateTeamInformation: function(requestData) {
          var dataString;
          dataString = 'method=updateTeamInformation';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        setTeamCaptains: function(requestData) {
          var dataString;
          dataString = 'method=setTeamCaptains&team_id=' + $rootScope.participantRegistration.teamId;
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getTeamCaptains: function() {
          return LuminateRESTService.teamraiserRequest('method=getTeamCaptains', false, true).then(function(response) {
            return response;
          });
        },
        updateCaptainsMessage: function(requestData) {
          var dataString;
          dataString = 'method=updateCaptainsMessage';
          if (requestData && requestData !== '') {
            dataString += '&' + requestData;
          }
          return LuminateRESTService.teamraiserRequest(dataString, true, true).then(function(response) {
            return response;
          });
        },
        getCaptainsMessage: function() {
          return LuminateRESTService.teamraiserRequest('method=getCaptainsMessage', true, true).then(function(response) {
            return response;
          });
        }
      };
    }
  ]);

  angular.module('trPcControllers').controller('ConsProfileViewCtrl', [
    '$scope', '$httpParamSerializer', '$translate', '$timeout', '$uibModal', 'ConstituentService', 'APP_INFO', function($scope, $httpParamSerializer, $translate, $timeout, $uibModal, ConstituentService, APP_INFO) {
      var getFieldLabelTranslations, listUserFieldsPromise, possibleFields;
      $scope.consProfilePromises = [];
      possibleFields = ['user_name', 'name.title', 'name.first', 'name.middle', 'name.last', 'name.suffix', 'name.prof_suffix', 'email.primary_address', 'email.accepts_email', 'primary_address.street1', 'primary_address.street2', 'primary_address.street3', 'primary_address.city', 'primary_address.state', 'primary_address.zip', 'primary_address.country', 'accepts_postal_mail', 'home_phone', 'birth_date', 'gender', 'employment.employer', 'employment.occupation'];
      $scope.cpvm = {
        profileFields: [],
        passwordFields: [
          {
            type: 'input',
            key: 'old_password',
            templateOptions: {
              type: 'password',
              label: 'Old Password',
              required: true
            }
          }, {
            type: 'input',
            key: 'user_password',
            templateOptions: {
              type: 'password',
              label: 'New Password',
              required: true
            }
          }, {
            type: 'input',
            key: 'retype_password',
            templateOptions: {
              type: 'password',
              label: 'Retype Password',
              required: true
            }
          }, {
            type: 'input',
            key: 'reminder_hint',
            templateOptions: {
              type: 'text',
              label: 'Reminder Hint',
              required: true
            }
          }
        ],
        profileModel: {},
        passwordModel: {
          old_password: '',
          user_password: '',
          retype_password: '',
          reminder_hint: ''
        },
        openChangePassword: $scope.openChangePassword,
        cancelChangePassword: $scope.cancelChangePassword,
        submitChangePassword: $scope.submitChangePassword,
        updateUserProfile: $scope.updateUserProfile
      };
      getFieldLabelTranslations = function() {
        if ($scope.getFieldLabelTranslationsTimeout) {
          $timeout.cancel($scope.getFieldLabelTranslationsTimeout);
        }
        return $translate(['old_password', 'new_password', 'new_password_repeat', 'password_hint']).then(function(translations) {
          return angular.forEach($scope.cpvm.passwordFields, function(passwordField) {
            switch (passwordField.key) {
              case 'old_password':
                return passwordField.templateOptions.label = translations.old_password;
              case 'user_password':
                return passwordField.templateOptions.label = translations.new_password;
              case 'retype_password':
                return passwordField.templateOptions.label = translations.new_password_repeat;
              case 'reminder_hint':
                return passwordField.templateOptions.label = translations.password_hint;
            }
          });
        }, function(translationIds) {
          return $scope.getFieldLabelTranslationsTimeout = $timeout(getFieldLabelTranslations, 500);
        });
      };
      getFieldLabelTranslations();
      $scope.openChangePassword = function() {
        return $scope.changePasswordModal = $uibModal.open({
          scope: $scope,
          appendTo: angular.element(document).find('div.ng-pc-container'),
          templateUrl: APP_INFO.rootPath + 'html/modal/changePassword.html'
        });
      };
      $scope.cancelChangePassword = function($event) {
        $event.preventDefault();
        return $scope.changePasswordModal.close();
      };
      $scope.getUser = function() {
        var getUserPromise;
        getUserPromise = ConstituentService.getUser().then(function(response) {
          $scope.constituent = response.data.getConsResponse;
          angular.forEach($scope.cpvm.profileFields, function(profileField) {
            var customFieldType, fieldName, fieldValue, i, j, ref, tempPath;
            fieldName = profileField.name;
            fieldValue = null;
            if (fieldName.indexOf("custom_") > -1) {
              customFieldType = fieldName.slice(7).replace(/\d+/g, "");
              if ($scope.constituent.custom && $scope.constituent.custom[customFieldType]) {
                angular.forEach($scope.constituent.custom[customFieldType], function(customField) {
                  if (fieldName === customField.id) {
                    return fieldValue = customField.content;
                  }
                });
              }
            } else if (fieldName.indexOf(".") > -1) {
              fieldName = fieldName.split(".");
              tempPath = $scope.constituent;
              for (i = j = 0, ref = fieldName.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                if (tempPath[fieldName[i]]) {
                  tempPath = tempPath[fieldName[i]];
                }
              }
              if (tempPath && !angular.isObject(tempPath)) {
                fieldValue = tempPath;
              }
            } else if ($scope.constituent[fieldName] && !angular.isObject($scope.constituent[fieldName])) {
              fieldValue = $scope.constituent[fieldName];
            }
            if (fieldValue) {
              switch (profileField.data.dataType) {
                case 'DATE':
                  fieldValue = fieldValue.split("-");
                  fieldValue = new Date(parseInt(fieldValue[0]), parseInt(fieldValue[1]) - 1, parseInt(fieldValue[2]), parseInt(fieldValue[3].split(":")[0]), parseInt(fieldValue[3].split(":")[1]));
                  break;
                case 'BOOLEAN':
                  fieldValue = fieldValue === 'true';
                  break;
                default:
                  fieldValue = fieldValue;
              }
            } else {
              fieldValue = null;
            }
            return $scope.cpvm.profileModel[profileField.key] = fieldValue;
          });
          if ($scope.constituent.reminder_hint) {
            $scope.cpvm.passwordModel["reminder_hint"] = $scope.constituent.reminder_hint;
          }
          $scope.cpvm.profileOptions.updateInitialValue();
          return response;
        });
        return $scope.consProfilePromises.push(getUserPromise);
      };
      listUserFieldsPromise = ConstituentService.listUserFields('access=update').then(function(response) {
        $scope.userFields = response.data.listConsFieldsResponse.field;
        if (!angular.isArray($scope.userFields)) {
          $scope.userFields = [$scope.userFields];
        }
        angular.forEach($scope.userFields, function(userField) {
          var choice, j, k, len, len1, maxYear, minYear, ref, ref1, ref2, ref3, thisField;
          if (possibleFields.indexOf(userField.name) > -1) {
            thisField = {
              type: null,
              key: userField.name.replace('.', '-'),
              name: userField.name,
              data: {
                dataType: userField.valueType,
                orderInd: possibleFields.indexOf(userField.name)
              },
              templateOptions: {
                label: userField.label,
                required: userField.required === 'true',
                maxChars: userField.maxChars
              }
            };
            switch (userField.valueType) {
              case 'BOOLEAN':
                thisField.type = 'checkbox';
                break;
              case 'DATE':
                thisField.type = 'datepicker';
                thisField.templateOptions.placeholder = 'MM/dd/yyyy';
                thisField.templateOptions.closeText = 'Close';
                thisField.templateOptions.dateOptions = {
                  dateFormat: 'MM/dd/yyyy'
                };
                if ((ref = userField.choices) != null ? ref.choice : void 0) {
                  minYear = maxYear = userField.choices.choice[0];
                  ref1 = userField.choices.choice;
                  for (j = 0, len = ref1.length; j < len; j++) {
                    choice = ref1[j];
                    minYear = (minYear < choice ? minYear : choice);
                  }
                  ref2 = userField.choices.choice;
                  for (k = 0, len1 = ref2.length; k < len1; k++) {
                    choice = ref2[k];
                    maxYear = (maxYear > choice ? maxYear : choice);
                  }
                  thisField.templateOptions.dateOptions.minDate = new Date(minYear, 0, 1);
                  thisField.templateOptions.dateOptions.maxDate = new Date(maxYear, 11, 31);
                }
                thisField.templateOptions.dateAltFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                break;
              case 'ENUMERATION':
                thisField.type = 'select';
                thisField.templateOptions.options = [];
                angular.forEach(userField.choices.choice, function(choice) {
                  return thisField.templateOptions.options.push({
                    name: choice === 'UNDEFINED' ? '' : choice,
                    value: choice
                  });
                });
                break;
              case 'TEXT':
                if ((ref3 = userField.choices) != null ? ref3.choice : void 0) {
                  thisField.type = 'select';
                  thisField.templateOptions.options = [];
                  angular.forEach(userField.choices.choice, function(choice) {
                    return thisField.templateOptions.options.push({
                      name: choice,
                      value: choice
                    });
                  });
                } else {
                  thisField.type = 'input';
                }
                break;
              default:
                thisField.type = 'input';
            }
            if (userField.name === 'user_name') {
              thisField.type = 'username';
              thisField.templateOptions.changePasswordLabel = 'Change Password';
              thisField.templateOptions.changePasswordAction = $scope.openChangePassword;
            }
            return $scope.cpvm.profileFields.push(thisField);
          }
        });
        $scope.cpvm.profileFields.sort(function(a, b) {
          return a.data.orderInd - b.data.orderInd;
        });
        $translate(['accept_email_label', 'accept_postal_mail_label', 'change_password_label']).then(function(translations) {
          angular.forEach($scope.cpvm.profileFields, function(profileField) {
            switch (profileField.name) {
              case 'accepts_postal_mail':
                return profileField.templateOptions.label = translations.accept_postal_mail_label;
              case 'email.accepts_email':
                return profileField.templateOptions.label = translations.accept_email_label;
              case 'user_name':
                return profileField.templateOptions.changePasswordLabel = translations.change_password_label;
            }
          });
          return $scope.cpvm.originalFields = angular.copy($scope.cpvm.profileFields);
        }, function(translationIds) {
          angular.forEach($scope.cpvm.profileFields, function(profileField) {
            switch (profileField.name) {
              case 'accepts_postal_mail':
                return profileField.templateOptions.label = translationIds.accept_postal_mail_label;
              case 'email.accepts_email':
                return profileField.templateOptions.label = translationIds.accept_email_label;
              case 'user_name':
                return profileField.templateOptions.changePasswordLabel = translationIds.change_password_label;
            }
          });
          return $scope.cpvm.originalFields = angular.copy($scope.cpvm.profileFields);
        });
        $scope.getUser();
        return response;
      });
      $scope.consProfilePromises.push(listUserFieldsPromise);
      $scope.updateUserProfile = function() {
        var updateUserPromise, userProfileUpdateFields;
        if ($scope.cpvm.profileForm.$valid) {
          userProfileUpdateFields = {};
          angular.forEach($scope.cpvm.profileModel, function(value, key) {
            var fixedKey;
            fixedKey = key.replace('-', '.');
            return userProfileUpdateFields[fixedKey] = value;
          });
          updateUserPromise = ConstituentService.update($httpParamSerializer(userProfileUpdateFields)).then(function(response) {
            if (response.data.errorResponse) {
              $scope.updateProfileSuccess = false;
              $scope.updateProfileFailure = true;
              if (response.data.errorResponse.message) {
                $scope.updateProfileFailureMessage = response.data.errorResponse.message;
              } else {
                $translate('profile_update_unexpected_error').then(function(translation) {
                  return $scope.updateProfileFailureMessage = translation;
                }, function(translationId) {
                  return $scope.updateProfileFailureMessage = translationId;
                });
              }
            } else {
              $scope.updateProfileSuccess = true;
              $scope.updateProfileFailure = false;
              $scope.cpvm.profileOptions.updateInitialValue();
            }
            return response;
          });
          return $scope.consProfilePromises.push(updateUserPromise);
        } else {
          $translate('profile_update_required_error').then(function(translation) {
            return $scope.updateProfileFailureMessage = translation;
          }, function(translationId) {
            return $scope.updateProfileFailureMessage = translationId;
          });
          $scope.updateProfileSuccess = false;
          return $scope.updateProfileFailure = true;
        }
      };
      $scope.submitChangePassword = function() {
        var changePasswordPromise;
        changePasswordPromise = ConstituentService.changePassword($httpParamSerializer($scope.cpvm.passwordModel)).then(function(response) {
          var reminderValue;
          if (response.data.errorResponse) {
            $scope.updatePasswordSuccess = false;
            $scope.updatePasswordFailure = true;
            if (response.data.errorResponse.message) {
              $scope.updatePasswordFailureMessage = response.data.errorResponse.message;
            } else {
              $translate('profile_update_unexpected_error').then(function(translation) {
                return $scope.updatePasswordFailureMessage = translation;
              }, function(translationId) {
                return $scope.updatePasswordFailureMessage = translationId;
              });
            }
            $scope.cpvm.passwordOptions.resetModel();
          } else {
            $scope.updatePasswordSuccess = true;
            $scope.updatePasswordFailure = false;
            $scope.changePasswordModal.close();
            reminderValue = $scope.cpvm.passwordModel["reminder_hint"];
            $scope.cpvm.passwordOptions.resetModel();
            $scope.cpvm.passwordModel["reminder_hint"] = reminderValue;
            $scope.cpvm.passwordOptions.updateInitialValue();
          }
          return response;
        });
        return $scope.consProfilePromises.push(changePasswordPromise);
      };
      $scope.resetProfileAlerts = function() {
        $scope.updateProfileSuccess = false;
        $scope.updateProfileFailure = false;
        $scope.updateProfileFailureMessage = '';
        $scope.updatePasswordSuccess = false;
        $scope.updatePasswordFailure = false;
        $scope.updatePasswordFailureMessage = '';
        return true;
      };
      return $scope.resetProfileAlerts();
    }
  ]);

  angular.module('trPcControllers').controller('DashboardViewCtrl', [
    '$scope', '$rootScope', '$location', '$uibModal', '$timeout', '$translate', '$window', 'ConstituentService', 'TeamraiserNewsFeedService', 'TeamraiserRegistrationService', 'TeamraiserRecentActivityService', 'ContactService', 'TeamraiserProgressService', 'TeamraiserEventService', 'TeamraiserGiftService', 'TeamraiserParticipantService', 'TeamraiserTeamService', 'TeamraiserShortcutURLService', 'APP_INFO', function($scope, $rootScope, $location, $uibModal, $timeout, $translate, $window, ConstituentService, TeamraiserNewsFeedService, TeamraiserRegistrationService, TeamraiserRecentActivityService, ContactService, TeamraiserProgressService, TeamraiserEventService, TeamraiserGiftService, TeamraiserParticipantService, TeamraiserTeamService, TeamraiserShortcutURLService, APP_INFO) {
      var captainsMessagePromise, closeAcknowledgeGiftModal, closeDeleteGiftModal, constituentPromise, contactFilters, getCompanyShortcutPromise, getConfigPromise, getParticipantShortcutPromise, getTeamShortcutPromise, participantPromise, ref, setPersonalDownloadUrl, setTeamCaptainsRosterPage, teamBadgesPromise, teamRosterPromise, translateGiftActionLabels, whatNextPromise;
      $scope.dashboardPromises = [];
      constituentPromise = ConstituentService.getUser().then(function(response) {
        $scope.constituent = response.data.getConsResponse;
        return response;
      });
      $scope.dashboardPromises.push(constituentPromise);
      participantPromise = TeamraiserParticipantService.getParticipant().then(function(response) {
        var badges, participantInfo, participantMilestoneLargeBadgeUrl, personalDonationBadgeLargeUrl, ref, ref1;
        participantInfo = ((ref = response.data.getParticipantsResponse) != null ? ref.participant : void 0) || {};
        if (participantInfo.personalPageUrl != null) {
          participantInfo.personalPageAbsoluteUrl = participantInfo.personalPageUrl;
          if (participantInfo.personalPageUrl.indexOf('/site/') !== -1) {
            participantInfo.personalPageUrl = participantInfo.personalPageUrl.split('/site/')[1];
          }
        }
        if (participantInfo.donationUrl != null) {
          participantInfo.donationAbsoluteUrl = participantInfo.donationUrl;
          if (participantInfo.donationUrl.indexOf('/site/') !== -1) {
            participantInfo.donationUrl = participantInfo.donationUrl.split('/site/')[1];
          }
        }
        if (participantInfo.teamPageUrl != null) {
          participantInfo.teamPageAbsoluteUrl = participantInfo.teamPageUrl;
          if (participantInfo.teamPageUrl.indexOf('/site/') !== -1) {
            participantInfo.teamPageUrl = participantInfo.teamPageUrl.split('/site/')[1];
          }
        }
        $scope.participant = participantInfo;
        badges = (ref1 = $scope.participant) != null ? ref1.badges : void 0;
        if (!badges) {
          $scope.participantBadges = [];
        } else {
          personalDonationBadgeLargeUrl = badges.personalDonationBadgeLargeUrl;
          if (personalDonationBadgeLargeUrl) {
            if (!$scope.participantBadges) {
              $scope.participantBadges = [];
            }
            $scope.participantBadges.push({
              url: '..' + personalDonationBadgeLargeUrl,
              name: badges.personalDonationBadgeName,
              description: badges.personalDonationBadgeDesc
            });
          }
          participantMilestoneLargeBadgeUrl = badges.participantMilestoneLargeBadgeUrl;
          if (participantMilestoneLargeBadgeUrl) {
            if (!$scope.participantBadges) {
              $scope.participantBadges = [];
            }
            $scope.participantBadges.push({
              url: '..' + participantMilestoneLargeBadgeUrl,
              name: badges.participantMilestoneBadgeName,
              description: badges.participantMilestoneBadgeDesc
            });
          }
        }
        return response;
      });
      $scope.dashboardPromises.push(participantPromise);
      setPersonalDownloadUrl = function() {
        $scope.teamraiserConfig = $rootScope.teamraiserConfig;
        if (!$scope.teamraiserConfig.personalDonationsDownloadUrl) {
          $scope.teamraiserConfig.personalDonationsDownloadUrl = 'TRParticipantDownload/Personal_Donations.csv?download_type=personal_donations&fr_id=' + $rootScope.frId;
        }
        return $scope.teamraiserConfig;
      };
      if (!$rootScope.teamraiserConfig || $rootScope.teamraiserConfig === -1) {
        getConfigPromise = TeamraiserEventService.getConfig().then(function(response) {
          setPersonalDownloadUrl();
          return response;
        });
        $scope.dashboardPromises.push(getConfigPromise);
      } else {
        setPersonalDownloadUrl();
      }
      $scope.showJanrainShare = ((ref = $rootScope.socialSettings.appName) != null ? ref.length : void 0) > 0;
      if ($scope.teamraiserConfig.adminNewsFeedsEnabled === 'true') {
        $scope.newsFeed = {
          page: 1,
          numPerPage: 1
        };
        $scope.getNewsFeeds = function() {
          var newsFeedsPromise, pageNumber;
          pageNumber = $scope.newsFeed.page - 1;
          newsFeedsPromise = TeamraiserNewsFeedService.getNewsFeeds('last_pc2_login=' + $scope.participantRegistration.lastPC2Login + '&feed_count=100').then(function(response) {
            var newsFeedItems;
            newsFeedItems = response.data.getNewsFeedsResponse.newsFeed;
            if (!angular.isArray(newsFeedItems)) {
              newsFeedItems = [newsFeedItems];
            }
            $scope.newsFeed.items = [];
            $scope.newsFeed.totalNumber = 0;
            angular.forEach(newsFeedItems, function(item, itemIndex) {
              var ref1;
              if (((ref1 = $scope.participant) != null ? ref1.aTeamCaptain : void 0) === 'true' || item.isCaptainsOnly === 'false') {
                $scope.newsFeed.totalNumber += 1;
                if (itemIndex > (pageNumber - 1) && $scope.newsFeed.items.length < $scope.newsFeed.numPerPage) {
                  return $scope.newsFeed.items.push(item);
                }
              }
            });
            return response;
          });
          return $scope.dashboardPromises.push(newsFeedsPromise);
        };
        $scope.getNewsFeeds();
      }
      TeamraiserRegistrationService.updateRegistration('update_last_pc2_login=true');
      $scope.recentActivity = {
        page: 1
      };
      $scope.getRecentActivity = function() {
        var pageNumber, recentActivityPromise;
        pageNumber = $scope.recentActivity.page - 1;
        recentActivityPromise = TeamraiserRecentActivityService.getRecentActivity().then(function(response) {
          var recentActivityRecords;
          recentActivityRecords = response.data.getRecentActivityResponse.activityRecord;
          if (!angular.isArray(recentActivityRecords)) {
            recentActivityRecords = [recentActivityRecords];
          }
          $scope.recentActivity.records = [];
          angular.forEach(recentActivityRecords, function(record, recordIndex) {
            if (recordIndex > (pageNumber * 5) - 1 && recordIndex < (pageNumber + 1) * 5) {
              return $scope.recentActivity.records.push(record);
            }
          });
          $scope.recentActivity.totalNumber = recentActivityRecords.length;
          return response;
        });
        return $scope.dashboardPromises.push(recentActivityPromise);
      };
      $scope.getRecentActivity();
      $scope.whatNextAction = function(subview) {
        switch (subview) {
          case 'PERSONAL_PAGE':
            $window.open($scope.participant.personalPageUrl, '_blank');
            break;
          case 'GOAL':
            $scope.editGoal('Participant');
            break;
          case 'CONTACTS':
            $location.path('/email/contacts');
            break;
          case 'COMPOSE':
            $location.path('/email/compose');
            break;
          case 'COMPOSE_THANKS':
            $location.path('/email/compose/group/email_rpt_show_unthanked_donors');
            break;
          case 'COMPOSE_OTHER':
            $location.path('/email/compose/group/email_rpt_show_never_emailed');
            break;
          case 'COMPOSE_FOLLOWUP':
            $location.path('/email/compose/group/email_rpt_show_nondonors_followup');
        }
        return subview;
      };
      $scope.whatNext = {
        suggestions: []
      };
      whatNextPromise = TeamraiserProgressService.getWhatNext().then(function(response) {
        var allSuggestions;
        allSuggestions = response.data.getTeamraiserSuggestionResponse.allSuggestions.suggestion;
        if (!angular.isArray(allSuggestions)) {
          allSuggestions = [allSuggestions];
        }
        $scope.whatNext.suggestions = [];
        angular.forEach(allSuggestions, function(suggestion, suggestionIndex) {
          suggestion.displayNumber = suggestionIndex + 1;
          suggestion.header = '';
          suggestion.nextAction = function() {
            return $scope.whatNextAction(suggestion.type);
          };
          return $scope.whatNext.suggestions.push(suggestion);
        });
        return $translate(['what_next_setup_your_personal_page_header', 'what_next_set_goal_header', 'what_next_send_email_header', 'what_next_reach_out_header', 'what_next_send_thanks_header', 'what_next_add_contacts_header', 'what_next_followup_header']).then(function(translations) {
          return angular.forEach($scope.whatNext.suggestions, function(suggestion) {
            switch (suggestion.type) {
              case 'PERSONAL_PAGE':
                return suggestion.header = translations.what_next_setup_your_personal_page_header;
              case 'GOAL':
                return suggestion.header = translations.what_next_set_goal_header;
              case 'CONTACTS':
                return suggestion.header = translations.what_next_add_contacts_header;
              case 'COMPOSE':
                return suggestion.header = translations.what_next_send_email_header;
              case 'COMPOSE_THANKS':
                return suggestion.header = translations.what_next_send_thanks_header;
              case 'COMPOSE_OTHER':
                return suggestion.header = translations.what_next_reach_out_header;
              case 'COMPOSE_FOLLOWUP':
                return suggestion.header = translations.what_next_followup_header;
            }
          });
        }, function(translationIds) {
          return angular.forEach($scope.whatNext.suggestions, function(suggestion) {
            switch (suggestion.type) {
              case 'PERSONAL_PAGE':
                return suggestion.header = translationIds.what_next_setup_your_personal_page_header;
              case 'GOAL':
                return suggestion.header = translationIds.what_next_set_goal_header;
              case 'CONTACTS':
                return suggestion.header = translationIds.what_next_add_contacts_header;
              case 'COMPOSE':
                return suggestion.header = translationIds.what_next_send_email_header;
              case 'COMPOSE_THANKS':
                return suggestion.header = translationIds.what_next_send_thanks_header;
              case 'COMPOSE_OTHER':
                return suggestion.header = translationIds.what_next_reach_out_header;
              case 'COMPOSE_FOLLOWUP':
                return suggestion.header = translationIds.what_next_followup_header;
            }
          });
        });
      });
      $scope.dashboardPromises.push(whatNextPromise);
      $scope.contactCounts = {};
      contactFilters = ['email_rpt_show_all', 'email_rpt_show_never_emailed', 'email_rpt_show_nondonors_followup', 'email_rpt_show_unthanked_donors', 'email_rpt_show_donors', 'email_rpt_show_nondonors'];
      angular.forEach(contactFilters, function(filter) {
        var contactCountPromise;
        contactCountPromise = ContactService.getTeamraiserAddressBookContacts('tr_ab_filter=' + filter + '&skip_groups=true&list_page_size=1').then(function(response) {
          $scope.contactCounts[filter] = response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults;
          return response;
        });
        return $scope.dashboardPromises.push(contactCountPromise);
      });
      $scope.participantProgress = {
        raised: 0,
        goal: 0,
        percent: 0
      };
      if ($scope.participantRegistration.teamId && $scope.participantRegistration.teamId !== '-1') {
        $scope.teamProgress = {
          raised: 0,
          goal: 0,
          percent: 0
        };
      }
      if ($scope.participantRegistration.companyInformation && $scope.participantRegistration.companyInformation.companyId) {
        $scope.companyProgress = {
          raised: 0,
          goal: 0,
          percent: 0
        };
      }
      $scope.refreshFundraisingProgress = function() {
        var fundraisingProgressPromise;
        fundraisingProgressPromise = TeamraiserProgressService.getProgress().then(function(response) {
          $scope.participantProgress = response.data.getParticipantProgressResponse.personalProgress;
          if ($scope.participantRegistration.teamId && $scope.participantRegistration.teamId !== '-1') {
            $scope.teamProgress = response.data.getParticipantProgressResponse.teamProgress;
          }
          if ($scope.participantRegistration.companyInformation && $scope.participantRegistration.companyInformation.companyId) {
            $scope.companyProgress = response.data.getParticipantProgressResponse.companyProgress;
          }
          return response;
        });
        return $scope.dashboardPromises.push(fundraisingProgressPromise);
      };
      $scope.refreshFundraisingProgress();
      $scope.editGoalOptions = {
        updateGoalSuccess: false,
        updateGoalFailure: false,
        updateGoalFailureMessage: '',
        updateGoalInput: 0
      };
      $scope.closeGoalAlerts = function(closeModal) {
        $scope.editGoalOptions.updateGoalSuccess = false;
        $scope.editGoalOptions.updateGoalFailure = false;
        $scope.editGoalOptions.updateGoalFailureMessage = '';
        if (closeModal) {
          return $scope.cancelEditGoal();
        }
      };
      $scope.editGoal = function(goalType) {
        $scope.closeGoalAlerts(false);
        switch (goalType) {
          case 'Participant':
            $scope.editGoalOptions.updateGoalInput = Math.floor(parseInt($scope.participantProgress.goal) / 100);
            break;
          case 'Team':
            $scope.editGoalOptions.updateGoalInput = Math.floor(parseInt($scope.teamProgress.goal) / 100);
            break;
          default:
            $scope.editGoalOptions.updateGoalInput = 0;
        }
        return $scope.editGoalModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/edit' + goalType + 'Goal.html'
        });
      };
      $scope.cancelEditGoal = function() {
        return $scope.editGoalModal.close();
      };
      $scope.updateGoal = function(goalType) {
        var dataStr, updateGoalPromise;
        $scope.closeGoalAlerts(false);
        switch (goalType) {
          case 'Participant':
            dataStr = 'goal=' + (100 * $scope.editGoalOptions.updateGoalInput).toString();
            updateGoalPromise = TeamraiserRegistrationService.updateRegistration(dataStr).then(function(response) {
              if (response.data.errorResponse) {
                $scope.editGoalOptions.updateGoalFailure = true;
                if (response.data.errorResponse.message) {
                  $scope.editGoalOptions.updateGoalFailureMessage = response.data.errorResponse.message;
                } else {
                  $translate('personal_goal_unexpected_error').then(function(translation) {
                    return $scope.editGoalOptions.updateGoalFailureMessage = translation;
                  }, function(translationId) {
                    return $scope.editGoalOptions.updateGoalFailureMessage = translationId;
                  });
                }
              } else {
                $scope.editGoalOptions.updateGoalSuccess = true;
                $scope.refreshFundraisingProgress();
              }
              return response;
            });
            return $scope.dashboardPromises.push(updateGoalPromise);
          case 'Team':
            dataStr = 'team_goal=' + (100 * $scope.editGoalOptions.updateGoalInput).toString();
            updateGoalPromise = TeamraiserTeamService.updateTeamInformation(dataStr).then(function(response) {
              if (response.data.errorResponse) {
                $scope.editGoalOptions.updateGoalFailure = true;
                if (response.data.errorResponse.message) {
                  $scope.editGoalOptions.updateGoalFailureMessage = response.data.errorResponse.message;
                } else {
                  $translate('team_goal_unexpected_error').then(function(translation) {
                    return $scope.editGoalOptions.updateGoalFailureMessage = translation;
                  }, function(translationId) {
                    return $scope.editGoalOptions.updateGoalFailureMessage = translationId;
                  });
                }
              } else {
                $scope.editGoalOptions.updateGoalSuccess = true;
                $scope.refreshFundraisingProgress();
              }
              return response;
            });
            return $scope.dashboardPromises.push(updateGoalPromise);
          case 'Company':

            /* No such API! */
        }
      };
      translateGiftActionLabels = function() {
        if ($scope.translateGiftActionLabelsTimeout) {
          $timeout.cancel($scope.translateGiftActionLabelsTimeout);
        }
        $scope.giftActionLabels = {
          acknowledgeGift: '',
          thankDonor: '',
          deleteGift: '',
          noAction: ''
        };
        return $translate(['gift_action_acknowledge_title', 'gift_action_thank_donor_title', 'gift_action_delete_title', 'gift_action_no_action_title']).then(function(translations) {
          $scope.giftActionLabels.acknowledgeGift = translations.gift_action_acknowledge_title;
          $scope.giftActionLabels.thankDonor = translations.gift_action_thank_donor_title;
          $scope.giftActionLabels.deleteGift = translations.gift_action_delete_title;
          return $scope.giftActionLabels.noAction = translations.gift_action_no_action_title;
        }, function(translationIds) {
          return $scope.translateGiftActionLabelsTimeout = $timeout(translateGiftActionLabels, 500);
        });
      };
      translateGiftActionLabels();
      $scope.participantGifts = {
        page: 1
      };
      $scope.getGifts = function() {
        var pageNumber, personalGiftsPromise;
        pageNumber = $scope.participantGifts.page - 1;
        personalGiftsPromise = TeamraiserGiftService.getGifts('list_sort_column=date_recorded&list_ascending=false&list_page_size=5&list_page_offset=' + pageNumber).then(function(response) {
          var participantGifts;
          participantGifts = response.data.getGiftsResponse.gift;
          if (!angular.isArray(participantGifts)) {
            participantGifts = [participantGifts];
          }
          $scope.participantGifts.gifts = [];
          angular.forEach(participantGifts, function(gift) {
            if (gift) {
              gift.contact = {
                firstName: gift.name.first,
                lastName: gift.name.last,
                email: gift.email,
                id: gift.contactId
              };
              return $scope.participantGifts.gifts.push(gift);
            }
          });
          $scope.participantGifts.giftActionLabels = $scope.giftActionLabels;
          $scope.participantGifts.totalNumber = Number(response.data.getGiftsResponse.totalNumberResults);
          return response;
        });
        return $scope.dashboardPromises.push(personalGiftsPromise);
      };
      $scope.getGifts();
      $scope.acknowledgeGift = function(contactId) {
        $scope.acknowledgeGiftContactId = contactId;
        return $scope.acknowledgeGiftModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/acknowledgeGift.html'
        });
      };
      closeAcknowledgeGiftModal = function() {
        delete $scope.acknowledgeGiftContactId;
        return $scope.acknowledgeGiftModal.close();
      };
      $scope.cancelAcknowledgeGift = function() {
        return closeAcknowledgeGiftModal();
      };
      $scope.confirmAcknowledgeGift = function() {
        var acknowledgeGiftPromise;
        if ($scope.acknowledgeGiftContactId) {
          acknowledgeGiftPromise = TeamraiserGiftService.acknowledgeGift('contact_id=' + $scope.acknowledgeGiftContactId).then(function(response) {
            closeAcknowledgeGiftModal();
            $scope.getGifts();
            if ($scope.participantRegistration.teamId && $scope.participantRegistration.teamId !== '-1') {
              $scope.teamGifts.page = 1;
              $scope.getTeamGifts();
            }
            return response;
          });
          return $scope.dashboardPromises.push(acknowledgeGiftPromise);
        }
      };
      $scope.deleteGift = function(giftId) {
        $scope.deleteGiftId = giftId;
        return $scope.deleteGiftModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/deleteGift.html'
        });
      };
      closeDeleteGiftModal = function() {
        delete $scope.deleteGiftId;
        return $scope.deleteGiftModal.close();
      };
      $scope.cancelDeleteGift = function() {
        return closeDeleteGiftModal();
      };
      $scope.confirmDeleteGift = function() {
        var deleteGiftPromise;
        if ($scope.deleteGiftId) {
          deleteGiftPromise = TeamraiserGiftService.deleteGift('gift_id=' + $scope.deleteGiftId).then(function(response) {
            closeDeleteGiftModal();
            $scope.getGifts();
            if ($scope.participantRegistration.teamId && $scope.participantRegistration.teamId !== '-1') {
              $scope.getTeamGifts();
            }
            return response;
          });
          return $scope.dashboardPromises.push(deleteGiftPromise);
        }
      };
      $scope.thankDonor = function(contact) {
        if (contact != null) {
          if (!$rootScope.selectedContacts) {
            $rootScope.selectedContacts = {};
          }
          $rootScope.selectedContacts.contacts = [contact];
          return $location.path('/email/compose');
        }
      };
      if ($scope.teamraiserConfig.personalPageEditing === 'PARTICIPANTS' || $scope.participantRegistration.teamId <= 0) {
        $scope.showPersonalPage = true;
      } else if ($scope.teamraiserConfig.personalPageEditing === 'CAPTAINS' && $scope.participantRegistration.aTeamCaptain === 'true') {
        $scope.showPersonalPage = true;
      } else {
        $scope.showPersonalPage = false;
      }
      getParticipantShortcutPromise = TeamraiserShortcutURLService.getShortcut().then(function(response) {
        var ref1;
        $scope.participantShortcut = (ref1 = response.data.getShortcutResponse) != null ? ref1.shortcutItem : void 0;
        return response;
      });
      $scope.dashboardPromises.push(getParticipantShortcutPromise);
      $scope.editPageUrlOptions = {
        updateUrlSuccess: false,
        updateUrlFailure: false,
        updateUrlFailureMessage: '',
        updateUrlInput: ''
      };
      $scope.closeUrlAlerts = function(closeModal) {
        $scope.editPageUrlOptions.updateUrlSuccess = false;
        $scope.editPageUrlOptions.updateUrlFailure = false;
        $scope.editPageUrlOptions.updateUrlFailureMessage = '';
        if (closeModal) {
          return $scope.cancelEditPageUrl();
        }
      };
      $scope.editPageUrl = function(urlType) {
        $scope.closeUrlAlerts(false);
        switch (urlType) {
          case 'Participant':
            $scope.editPageUrlOptions.updateUrlInput = $scope.participantShortcut.text || '';
            break;
          case 'Team':
            $scope.editPageUrlOptions.updateUrlInput = $scope.teamShortcut.text || '';
            break;
          case 'Company':
            $scope.editPageUrlOptions.updateUrlInput = $scope.companyShortcut.text || '';
            break;
          default:
            $scope.editPageUrlOptions.updateUrlInput = '';
        }
        return $scope.editPageUrlModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/edit' + urlType + 'PageUrl.html'
        });
      };
      $scope.cancelEditPageUrl = function() {
        return $scope.editPageUrlModal.close();
      };
      $scope.updatePageUrl = function(urlType) {
        var dataStr, updateUrlPromise;
        $scope.closeUrlAlerts(false);
        if ($scope.editPageUrlOptions.updateUrlInput.length < 5) {
          $scope.editPageUrlOptions.updateUrlFailure = true;
          return $translate('shortcut_error_min_length').then(function(translation) {
            return $scope.editPageUrlOptions.updateUrlFailureMessage = translation;
          }, function(translationId) {
            return $scope.editPageUrlOptions.updateUrlFailureMessage = translationId;
          });
        } else {
          dataStr = 'text=' + $scope.editPageUrlOptions.updateUrlInput;
          switch (urlType) {
            case 'Participant':
              updateUrlPromise = TeamraiserShortcutURLService.updateShortcut(dataStr).then(function(response) {
                var ref1, ref2;
                if (response.data.errorResponse) {
                  $scope.editPageUrlOptions.updateUrlFailure = true;
                  if ((ref1 = response.data.errorResponse) != null ? ref1.message : void 0) {
                    $scope.editPageUrlOptions.updateUrlFailureMessage = response.data.errorResponse.message;
                  } else {
                    $translate('shortcut_save_failure').then(function(translation) {
                      return $scope.editPageUrlOptions.updateUrlFailureMessage = translation;
                    }, function(translationId) {
                      return $scope.editPageUrlOptions.updateUrlFailureMessage = translationId;
                    });
                  }
                } else {
                  $scope.editPageUrlOptions.updateUrlSuccess = true;
                  $scope.participantShortcut = (ref2 = response.data.updateShortcutResponse) != null ? ref2.shortcutItem : void 0;
                }
                return response;
              });
              return $scope.dashboardPromises.push(updateUrlPromise);
            case 'Team':
              updateUrlPromise = TeamraiserShortcutURLService.updateTeamShortcut(dataStr).then(function(response) {
                var ref1, ref2;
                if (response.data.errorResponse) {
                  $scope.editPageUrlOptions.updateUrlFailure = true;
                  if ((ref1 = response.data.errorResponse) != null ? ref1.message : void 0) {
                    $scope.editPageUrlOptions.updateUrlFailureMessage = response.data.errorResponse.message;
                  } else {
                    $translate('teampage_shortcut_save_failure').then(function(translation) {
                      return $scope.editPageUrlOptions.updateUrlFailureMessage = translation;
                    }, function(translationId) {
                      return $scope.editPageUrlOptions.updateUrlFailureMessage = translationId;
                    });
                  }
                } else {
                  $scope.editPageUrlOptions.updateUrlSuccess = true;
                  $scope.teamShortcut = (ref2 = response.data.updateTeamShortcutResponse) != null ? ref2.shortcutItem : void 0;
                }
                return response;
              });
              return $scope.dashboardPromises.push(updateUrlPromise);
            case 'Company':
              updateUrlPromise = TeamraiserShortcutURLService.updateCompanyShortcut(dataStr).then(function(response) {
                var ref1, ref2;
                if (response.data.errorResponse) {
                  $scope.editPageUrlOptions.updateUrlFailure = true;
                  if ((ref1 = response.data.errorResponse) != null ? ref1.message : void 0) {
                    $scope.editPageUrlOptions.updateUrlFailureMessage = response.data.errorResponse.message;
                  } else {
                    $translate('company_page_shortcut_save_failure').then(function(translation) {
                      return $scope.editPageUrlOptions.updateUrlFailureMessage = translation;
                    }, function(translationId) {
                      return $scope.editPageUrlOptions.updateUrlFailureMessage = translationId;
                    });
                  }
                } else {
                  $scope.editPageUrlOptions.updateUrlSuccess = true;
                  $scope.companyShortcut = (ref2 = response.data.updateCompanyShortcutResponse) != null ? ref2.shortcutItem : void 0;
                }
                return response;
              });
              return $scope.dashboardPromises.push(updateUrlPromise);
          }
        }
      };
      if ($scope.participantRegistration.teamId && $scope.participantRegistration.teamId !== '-1') {
        captainsMessagePromise = TeamraiserTeamService.getCaptainsMessage().then(function(response) {
          $scope.teamCaptainsMessage = response.data.getCaptainsMessageResponse;
          if (!angular.isString($scope.teamCaptainsMessage.message)) {
            delete $scope.teamCaptainsMessage.message;
          }
          $scope.teamCaptainsMessage.inEditMode = false;
          return response;
        });
        $scope.dashboardPromises.push(captainsMessagePromise);
        $scope.editTeamCaptainsMessage = function() {
          return $scope.teamCaptainsMessage.inEditMode = true;
        };
        $scope.saveTeamCaptainsMessage = function() {
          var updateCaptainsMessagePromise;
          updateCaptainsMessagePromise = TeamraiserTeamService.updateCaptainsMessage('captains_message=' + encodeURIComponent($scope.teamCaptainsMessage.message)).then(function(response) {
            $scope.teamCaptainsMessage.inEditMode = false;
            return response;
          });
          return $scope.dashboardPromises.push(updateCaptainsMessagePromise);
        };
        teamRosterPromise = TeamraiserTeamService.getTeamRoster('include_download_url=true&positive_amount_only=true').then(function(response) {
          if (response.data.getTeamRosterResponse) {
            $scope.teamRosterDownloadUrl = response.data.getTeamRosterResponse.teamRosterDownloadUrl || 'TRParticipantDownload/Team_Roster.csv?download_type=team_roster&fr_id=' + $rootScope.frId;
            $scope.teamDonationsDownloadUrl = response.data.getTeamRosterResponse.teamDonationsDownloadUrl || 'TRParticipantDownload/Team_Donations.csv?download_type=team_donations&fr_id=' + $rootScope.frId;
          }
          return response;
        });
        $scope.dashboardPromises.push(teamRosterPromise);
        teamBadgesPromise = TeamraiserTeamService.getTeam().then(function(response) {
          var badges, ref1, team, teamMilestoneBadgeLargeUrl;
          team = (ref1 = response.data.getTeamSearchByInfoResponse) != null ? ref1.team : void 0;
          badges = team != null ? team.badges : void 0;
          if (!badges) {
            $scope.teamBadges = [];
          } else {
            teamMilestoneBadgeLargeUrl = badges.teamMilestoneBadgeLargeUrl;
            if (teamMilestoneBadgeLargeUrl) {
              if (!$scope.teamBadges) {
                $scope.teamBadges = [];
              }
              $scope.teamBadges.push({
                url: '..' + teamMilestoneBadgeLargeUrl,
                name: badges.teamMilestoneBadgeName,
                description: badges.teamMilestoneBadgeDesc
              });
            }
          }
          return response;
        });
        $scope.dashboardPromises.push(teamBadgesPromise);
        $scope.teamGifts = {
          page: 1
        };
        $scope.getTeamGifts = function() {
          var pageNumber, teamGiftsPromise;
          pageNumber = $scope.teamGifts.page - 1;
          teamGiftsPromise = TeamraiserGiftService.getTeamGifts('list_sort_column=date_recorded&list_ascending=false&list_page_size=5&list_page_offset=' + pageNumber).then(function(response) {
            var teamGifts;
            teamGifts = response.data.getGiftsResponse.gift;
            if (!angular.isArray(teamGifts)) {
              teamGifts = [teamGifts];
            }
            $scope.teamGifts.gifts = [];
            angular.forEach(teamGifts, function(gift) {
              if (gift) {
                gift.contact = {
                  firstName: gift.name.first,
                  lastName: gift.name.last,
                  email: gift.email,
                  id: gift.contactId
                };
                return $scope.teamGifts.gifts.push(gift);
              }
            });
            $scope.teamGifts.giftActionLabels = $scope.giftActionLabels;
            $scope.teamGifts.totalNumber = Number(response.data.getGiftsResponse.totalNumberResults);
            return response;
          });
          return $scope.dashboardPromises.push(teamGiftsPromise);
        };
        $scope.getTeamGifts();
        $scope.editTeamName = {
          newTeamName: '',
          editTeamNameSuccess: false,
          editTeamNameFailure: false,
          editTeamNameFailureMessage: ''
        };
        $scope.changeTeamName = function() {
          $scope.editTeamName.newTeamName = $scope.participant.teamName;
          return $scope.editTeamNameModal = $uibModal.open({
            scope: $scope,
            templateUrl: APP_INFO.rootPath + 'html/modal/editTeamName.html'
          });
        };
        $scope.updateTeamName = function() {
          var dataStr, updateTeamNamePromise;
          $scope.cancelEditTeamName(false);
          dataStr = 'team_name=' + $scope.editTeamName.newTeamName;
          updateTeamNamePromise = TeamraiserTeamService.updateTeamInformation(dataStr).then(function(response) {
            var ref1;
            if (response.data.errorResponse) {
              $scope.editTeamName.editTeamNameFailure = true;
              if (response.data.errorResponse.message) {
                $scope.editTeamName.editTeamNameFailureMessage = (ref1 = response.data.errorResponse) != null ? ref1.message : void 0;
              } else {
                $translate('team_name_update_unexpected_error').then(function(translation) {
                  return $scope.editTeamName.editTeamNameFailureMessage = translation;
                }, function(translationId) {
                  return $scope.editTeamName.editTeamNameFailureMessage = translationId;
                });
              }
            } else {
              $scope.editTeamName.editTeamNameSuccess = true;
            }
            return response;
          });
          return $scope.dashboardPromises.push(updateTeamNamePromise);
        };
        $scope.cancelEditTeamName = function(closeModal) {
          $scope.editTeamName.editTeamNameSuccess = false;
          $scope.editTeamName.editTeamNameFailure = false;
          $scope.editTeamName.editTeamNameFailureMessage = '';
          if (closeModal) {
            $scope.editTeamName.newTeamName = '';
            return $scope.editTeamNameModal.close();
          }
        };
        $scope.changeTeamCaptains = function() {
          var teamCaptainsRosterPromise;
          $scope.editTeamCaptains = {
            success: false,
            failure: false,
            failureMessage: '',
            maxCaptains: $scope.teamraiserConfig.teamCaptainsMaximum,
            currCaptains: 0,
            teamRoster: [],
            teamSize: 1,
            teamRosterPage: 1,
            teamPageSize: 5
          };
          teamCaptainsRosterPromise = TeamraiserParticipantService.getParticipants('first_name=' + encodeURIComponent('%%%') + '&list_filter_column=reg.team_id&list_filter_text=' + $scope.participantRegistration.teamId + '&list_page_size=400&list_page_offset=0').then(function(response) {
            var ref1, teamRoster;
            teamRoster = (ref1 = response.data.getParticipantsResponse) != null ? ref1.participant : void 0;
            if (!angular.isArray(teamRoster)) {
              teamRoster = [teamRoster];
            }
            $scope.editTeamCaptains.teamSize = response.data.getParticipantsResponse.totalNumberResults;
            angular.forEach(teamRoster, function(member) {
              if (member != null ? member.consId : void 0) {
                member.consId = parseInt(member.consId);
                member.aTeamCaptain = member.aTeamCaptain === "true";
                if (member.aTeamCaptain) {
                  return $scope.editTeamCaptains.teamSize = $scope.editTeamCaptains.teamSize - 1;
                }
              }
            });
            $scope.editTeamCaptains.teamRoster = teamRoster.sort(function(a, b) {
              var aName, bName, ref2, ref3;
              if (a.consId === $rootScope.consId) {
                return -1;
              } else if (b.consId === $rootScope.consId) {
                return 1;
              } else {
                aName = ((ref2 = a.name) != null ? ref2.screenname : void 0) ? a.name.screenname.toLowerCase() : a.name.last.toLowerCase() + ', ' + a.name.first.toLowerCase();
                bName = ((ref3 = b.name) != null ? ref3.screenname : void 0) ? b.name.screenname.toLowerCase() : b.name.last.toLowerCase() + ', ' + b.name.first.toLowerCase();
                if (aName < bName) {
                  return -1;
                } else if (aName > bName) {
                  return 1;
                } else {
                  return 0;
                }
              }
            });
            setTeamCaptainsRosterPage();
            return response;
          });
          $scope.dashboardPromises.push(teamCaptainsRosterPromise);
          return $scope.editTeamCaptainsModal = $uibModal.open({
            scope: $scope,
            templateUrl: APP_INFO.rootPath + 'html/modal/editTeamCaptains.html'
          });
        };
        setTeamCaptainsRosterPage = function() {
          var currMembers, currentPage, maxPageSize;
          currentPage = 1;
          currMembers = 0;
          maxPageSize = $scope.editTeamCaptains.teamPageSize;
          angular.forEach($scope.editTeamCaptains.teamRoster, function(member) {
            if (member != null ? member.consId : void 0) {
              member.displayPage = member.consId === $rootScope.consId ? 0 : currentPage;
              if (!member.aTeamCaptain) {
                currMembers = currMembers + 1;
                if (currMembers >= maxPageSize) {
                  currentPage = currentPage + 1;
                  return currMembers = 0;
                }
              }
            }
          });
          return $scope.editTeamCaptains.teamRoster;
        };
        $scope.toggleTeamCaptain = function(consId) {
          var found;
          found = false;
          angular.forEach($scope.editTeamCaptains.teamRoster, function(member) {
            if (consId === member.consId) {
              found = true;
              member.aTeamCaptain = !member.aTeamCaptain;
              return $scope.editTeamCaptains.teamSize = $scope.editTeamCaptains.teamSize + (member.aTeamCaptain ? -1 : 1);
            }
          });
          if (found) {
            setTeamCaptainsRosterPage();
          }
          return found;
        };
        $scope.confirmChangeTeamCaptains = function() {
          var dataStr, newCaptainConsIds, setTeamCaptainsPromise;
          $scope.resetTeamCaptainAlerts(false);
          newCaptainConsIds = [];
          angular.forEach($scope.editTeamCaptains.teamRoster, function(member) {
            if ((member != null ? member.consId : void 0) && (member != null ? member.aTeamCaptain : void 0)) {
              return newCaptainConsIds.push(member.consId);
            }
          });
          if (newCaptainConsIds.length === 0) {
            $scope.editTeamCaptains.failure = true;
            return $translate('team_captains_failure_minimum').then(function(translation) {
              return $scope.editTeamCaptains.failureMessage = translation;
            }, function(translationId) {
              return $scope.editTeamCaptains.failureMessage = translationId;
            });
          } else if (newCaptainConsIds.length > $scope.teamraiserConfig.teamCaptainsMaximum) {
            $scope.editTeamCaptains.failure = true;
            return $translate('team_captains_failure_maximum', {
              max: $scope.editTeamCaptains.maxCaptains
            }).then(function(translation) {
              return $scope.editTeamCaptains.failureMessage = translation;
            }, function(translationId) {
              return $scope.editTeamCaptains.failureMessage = translationId;
            });
          } else {
            dataStr = 'captains=' + newCaptainConsIds.toString();
            setTeamCaptainsPromise = TeamraiserTeamService.setTeamCaptains(dataStr).then(function(response) {
              if (response.data.errorResponse) {
                $scope.editTeamCaptains.failure = true;
                if (response.data.errorResponse.message) {
                  $scope.editTeamCaptains.failureMessage = response.data.errorResponse.message;
                } else {
                  $translate('captains_save_failure').then(function(translation) {
                    return $scope.editTeamCaptains.failureMessage = translation;
                  }, function(translationId) {
                    return $scope.editTeamCaptains.failureMessage = translationId;
                  });
                }
              } else {
                $scope.editTeamCaptains.success = true;
                $scope.getTeamMembers();
              }
              return response;
            });
            return $scope.dashboardPromises.push(setTeamCaptainsPromise);
          }
        };
        $scope.resetTeamCaptainAlerts = function(closeModal) {
          $scope.editTeamCaptains.success = false;
          $scope.editTeamCaptains.failure = false;
          $scope.editTeamCaptains.failureMessage = '';
          if (closeModal) {
            return $scope.editTeamCaptainsModal.close();
          }
        };
        $scope.editTeamPassword = {
          newTeamPassword: '',
          editTeamPasswordSuccess: false,
          editTeamPasswordFailure: false,
          editTeamPasswordFailureMessage: ''
        };
        $scope.setTeamPassword = function() {
          var ref1;
          $scope.editTeamPassword.newTeamPassword = ((ref1 = $scope.participantRegistration.teamInformation) != null ? ref1.password : void 0) || '';
          return $scope.editTeamPasswordModal = $uibModal.open({
            scope: $scope,
            templateUrl: APP_INFO.rootPath + 'html/modal/editTeamPassword.html'
          });
        };
        $scope.updateTeamPassword = function() {
          var dataStr, updateTeamPasswordPromise;
          $scope.cancelEditTeamPassword(false);
          dataStr = 'password=' + $scope.editTeamPassword.newTeamPassword;
          updateTeamPasswordPromise = TeamraiserTeamService.updateTeamInformation(dataStr).then(function(response) {
            if (response.data.errorResponse) {
              $scope.editTeamPassword.editTeamPasswordFailure = true;
              if (response.data.errorResponse.message) {
                $scope.editTeamPassword.editTeamPasswordFailureMessage = response.data.errorResponse.message;
              } else {
                $translate('team_password_update_unexpected_error').then(function(translation) {
                  return $scope.editTeamPassword.editTeamPasswordFailureMessage = translation;
                }, function(translationId) {
                  return $scope.editTeamPassword.editTeamPasswordFailureMessage = translationId;
                });
              }
            } else {
              $scope.editTeamPassword.editTeamPasswordSuccess = true;
            }
            return response;
          });
          return $scope.dashboardPromises.push(updateTeamPasswordPromise);
        };
        $scope.cancelEditTeamPassword = function(closeModal) {
          $scope.editTeamPassword.editTeamPasswordSuccess = false;
          $scope.editTeamPassword.editTeamPasswordFailure = false;
          $scope.editTeamPassword.editTeamPasswordFailureMessage = '';
          if (closeModal) {
            $scope.editTeamPassword.newTeamPassword = '';
            return $scope.editTeamPasswordModal.close();
          }
        };
        $scope.teamMembers = {
          page: 1
        };
        $scope.getTeamMembers = function() {
          var pageNumber, teamMembersPromise;
          pageNumber = $scope.teamMembers.page - 1;
          teamMembersPromise = TeamraiserParticipantService.getParticipants('first_name=' + encodeURIComponent('%%%') + '&list_filter_column=reg.team_id&list_filter_text=' + $scope.participantRegistration.teamId + '&list_page_size=5&list_page_offset=' + pageNumber).then(function(response) {
            var teamMembers;
            teamMembers = response.data.getParticipantsResponse.participant;
            if (!angular.isArray(teamMembers)) {
              teamMembers = [teamMembers];
            }
            $scope.teamMembers.members = teamMembers;
            $scope.teamMembers.totalNumber = response.data.getParticipantsResponse.totalNumberResults;
            return response;
          });
          return $scope.dashboardPromises.push(teamMembersPromise);
        };
        $scope.getTeamMembers();
        getTeamShortcutPromise = TeamraiserShortcutURLService.getTeamShortcut().then(function(response) {
          var ref1;
          $scope.teamShortcut = (ref1 = response.data.getTeamShortcutResponse) != null ? ref1.shortcutItem : void 0;
          return response;
        });
        $scope.dashboardPromises.push(getTeamShortcutPromise);
      }
      if ($scope.participantRegistration.companyInformation && $scope.participantRegistration.companyInformation.companyId) {
        $scope.companyTeams = {
          page: 1
        };
        $scope.getCompanyTeams = function() {
          var companyTeamsPromise, pageNumber;
          pageNumber = $scope.companyTeams.page - 1;
          companyTeamsPromise = TeamraiserTeamService.getTeams('team_company_id=' + $scope.participantRegistration.companyInformation.companyId + '&list_page_size=5&list_page_offset=' + pageNumber).then(function(response) {
            var companyTeams;
            companyTeams = response.data.getTeamSearchByInfoResponse.team;
            if (!angular.isArray(companyTeams)) {
              companyTeams = [companyTeams];
            }
            $scope.companyTeams.teams = companyTeams;
            $scope.companyTeams.totalNumber = response.data.getTeamSearchByInfoResponse.totalNumberResults;
            return response;
          });
          return $scope.dashboardPromises.push(companyTeamsPromise);
        };
        $scope.getCompanyTeams();
        getCompanyShortcutPromise = TeamraiserShortcutURLService.getCompanyShortcut().then(function(response) {
          var ref1;
          $scope.companyShortcut = (ref1 = response.data.getCompanyShortcutResponse) != null ? ref1.shortcutItem : void 0;
          return response;
        });
        return $scope.dashboardPromises.push(getCompanyShortcutPromise);
      }
    }
  ]);

  angular.module('trPcControllers').controller('EmailComposeViewCtrl', [
    '$rootScope', '$scope', '$routeParams', '$timeout', '$httpParamSerializer', '$uibModal', '$translate', '$sce', '$window', 'TeamraiserEventService', 'TeamraiserEmailService', 'ContactService', 'APP_INFO', function($rootScope, $scope, $routeParams, $timeout, $httpParamSerializer, $uibModal, $translate, $sce, $window, TeamraiserEventService, TeamraiserEmailService, ContactService, APP_INFO) {
      var closeEmailPreviewModal, contactFilters, getEmailMessageBody, getMessageLayoutsPromise, getSelectedContactsString, getSuggestedMessageTypeTranslations, getSuggestedMessages, personalizedGreetingEnabledPromise, ref, refreshContactsNavBar, sanitizeEmailComposer, saveDraft, setEmailComposerDefaults, setEmailMessageBody;
      $scope.messageType = $routeParams.messageType;
      $scope.messageId = $routeParams.messageId;
      $scope.refreshContactsNav = 0;
      $scope.emailPromises = [];
      refreshContactsNavBar = function() {
        return $scope.refreshContactsNav = $scope.refreshContactsNav + 1;
      };
      $scope.resetEmailComposeAlerts = function() {
        $rootScope.scrollToTop();
        $scope.sendEmailError = false;
        $scope.sendEmailSuccess = false;
        $scope.saveDraftError = false;
        $scope.saveDraftSuccess = false;
        $scope.deleteDraftError = false;
        return $scope.deleteDraftSuccess = false;
      };
      if (!((ref = $rootScope.selectedContacts) != null ? ref.contacts : void 0)) {
        ContactService.resetSelectedContacts();
      }
      getSelectedContactsString = function() {
        var recipients, ref1;
        recipients = '';
        if ((((ref1 = $rootScope.selectedContacts) != null ? ref1.contacts : void 0) != null) && $rootScope.selectedContacts.contacts.length > 0) {
          angular.forEach($rootScope.selectedContacts.contacts, function(contact) {
            if ((contact != null ? contact.id : void 0) && (contact != null ? contact.email : void 0)) {
              if (recipients.length > 0) {
                recipients += ', ';
              }
              return recipients += ContactService.getContactString(contact);
            }
          });
        }
        return recipients;
      };
      contactFilters = ['email_rpt_show_all', 'email_rpt_show_never_emailed', 'email_rpt_show_nondonors_followup', 'email_rpt_show_unthanked_donors', 'email_rpt_show_donors', 'email_rpt_show_nondonors'];
      if ($rootScope.participantRegistration.previousEventParticipant === "true") {
        contactFilters.push('email_rpt_show_ly_donors');
        contactFilters.push('email_rpt_show_lybunt_donors');
      }
      if ($rootScope.participantRegistration.teamId !== "-1") {
        contactFilters.push('email_rpt_show_teammates');
        contactFilters.push('email_rpt_show_nonteammates');
        if ($rootScope.participantRegistration.previousEventParticipant === "true") {
          contactFilters.push('email_rpt_show_ly_teammates');
          contactFilters.push('email_rpt_show_ly_unreg_teammates');
        }
      }
      setEmailComposerDefaults = function() {
        var defaultStationeryId;
        defaultStationeryId = $rootScope.teamraiserConfig.defaultStationeryId;
        $scope.sendingEmail = false;
        return $scope.emailComposer = {
          just_updated: true,
          message_id: '',
          message_name: '',
          layout_id: defaultStationeryId !== '-1' ? defaultStationeryId : '',
          recipients: getSelectedContactsString(),
          suggested_message_id: '',
          subject: '',
          prepend_salutation: true,
          message_body: '',
          save_template_id: '',
          save_template: false
        };
      };
      setEmailComposerDefaults();
      $scope.resetComposer = function() {
        ContactService.resetSelectedContacts();
        $scope.resetEmailComposeAlerts();
        return setEmailComposerDefaults();
      };
      setEmailMessageBody = function(messageBody) {
        if (messageBody == null) {
          messageBody = '';
        }
        if (!messageBody || !angular.isString(messageBody)) {
          messageBody = '';
        }
        return $scope.emailComposer.message_body = messageBody;
      };
      getEmailMessageBody = function() {
        var $messageBody, message_body;
        $messageBody = jQuery('<div />', {
          html: $scope.emailComposer.message_body
        });
        message_body = $messageBody.html().replace(/<\/?[A-Z]+.*?>/g, function(m) {
          return m.toLowerCase();
        }).replace(/<font>/g, '<span>').replace(/<font /g, '<span ').replace(/<\/font>/g, '</span>').replace(/<b>/g, '<strong>').replace(/<b /g, '<strong ').replace(/<\/b>/g, '</strong>').replace(/<i>/g, '<em>').replace(/<i /g, '<em ').replace(/<\/i>/g, '</em>').replace(/<u>/g, '<span style="text-decoration: underline;">').replace(/<u /g, '<span style="text-decoration: underline;" ').replace(/<\/u>/g, '</span>').replace(/[\u00A0-\u9999\&]/gm, function(i) {
          return '&#' + i.charCodeAt(0) + ';';
        }).replace(/&#38;/g, '&').replace(/<!--[\s\S]*?-->/g, '');
        return message_body;
      };
      getSuggestedMessageTypeTranslations = function() {
        return $translate(['email_template_radio_recruit_label', 'email_template_radio_solicit_label', 'email_template_radio_thanks_label', 'email_template_radio_other_label', 'email_template_radio_custom_label']).then(function(translations) {
          $scope.suggestedMessageGroupLabels = {
            recruit: translations.email_template_radio_recruit_label,
            solicit: translations.email_template_radio_solicit_label,
            thanks: translations.email_template_radio_thanks_label,
            other: translations.email_template_radio_other_label,
            custom: translations.email_template_radio_custom_label
          };
          return getSuggestedMessages();
        }, function(translationIds) {
          return $timeout(getSuggestedMessageTypeTranslations, 500);
        });
      };
      getSuggestedMessageTypeTranslations();
      getSuggestedMessages = function() {
        var suggestedMessagesPromise;
        suggestedMessagesPromise = TeamraiserEmailService.getSuggestedMessages().then(function(response) {
          var suggestedMessages;
          suggestedMessages = response.data.getSuggestedMessagesResponse.suggestedMessage;
          if (!angular.isArray(suggestedMessages)) {
            suggestedMessages = [suggestedMessages];
          }
          $scope.suggestedMessages = [];
          $scope.suggestedMessageTemplates = [];
          angular.forEach(suggestedMessages, function(message) {
            if (message.active === 'true' || message.personal === 'true') {
              if (message.personal === 'true') {
                message.messageGroup = $scope.suggestedMessageGroupLabels.custom;
              } else {
                switch (message.messageType) {
                  case 'RECRUIT':
                    message.messageGroup = $scope.suggestedMessageGroupLabels.recruit;
                    break;
                  case 'SOLICIT':
                    message.messageGroup = $scope.suggestedMessageGroupLabels.solicit;
                    break;
                  case 'THANKS':
                    message.messageGroup = $scope.suggestedMessageGroupLabels.thanks;
                    break;
                  default:
                    message.messageGroup = $scope.suggestedMessageGroupLabels.other;
                }
              }
              $scope.suggestedMessages.push(message);
              if (message.personal === 'true') {
                return $scope.suggestedMessageTemplates.push(message.messageId);
              }
            }
          });
          return response;
        });
        return $scope.emailPromises.push(suggestedMessagesPromise);
      };
      if ($scope.messageType === 'draft' && $scope.messageId) {
        TeamraiserEmailService.getDraft('message_id=' + $scope.messageId).then(function(response) {
          var messageBody, messageInfo, ref1, ref2, ref3;
          if (response.data.errorResponse) {

          } else {
            messageInfo = (ref1 = response.data.getDraftResponse) != null ? ref1.messageInfo : void 0;
            if (messageInfo) {
              $scope.emailComposer.message_id = $scope.messageId;
              if ((ref2 = messageInfo.messageName) != null ? ref2.match('&amp;') : void 0) {
                messageInfo.messageName = messageInfo.messageName.replace('&amp;', '&');
              }
              if ((ref3 = messageInfo.subject) != null ? ref3.match('&amp;') : void 0) {
                messageInfo.subject = messageInfo.subject.replace('&amp;', '&');
              }
              if (angular.isString(messageInfo.messageName)) {
                $scope.emailComposer.message_name = messageInfo.messageName;
              } else {
                $scope.emailComposer.message_name = messageInfo.subject;
              }
              $scope.emailComposer.subject = messageInfo.subject;
              $scope.emailComposer.prepend_salutation = messageInfo.prependsalutation === 'true';
              messageBody = messageInfo.messageBody;
              return setEmailMessageBody(messageBody);
            }
          }
        });
      } else if ($scope.messageType === 'copy' && $scope.messageId) {
        TeamraiserEmailService.getSentMessage('message_id=' + $scope.messageId).then(function(response) {
          var messageBody, messageInfo, ref1, ref2, ref3;
          if (response.data.errorResponse) {

          } else {
            messageInfo = (ref1 = response.data.getSentMessageResponse) != null ? ref1.messageInfo : void 0;
            if (messageInfo) {
              if ((ref2 = messageInfo.messageName) != null ? ref2.match('&amp;') : void 0) {
                messageInfo.messageName = messageInfo.messageName.replace('&amp;', '&');
              }
              if ((ref3 = messageInfo.subject) != null ? ref3.match('&amp;') : void 0) {
                messageInfo.subject = messageInfo.subject.replace('&amp;', '&');
              }
              $scope.messageId = '';
              $scope.emailComposer.message_id = '';
              $scope.emailComposer.message_name = messageInfo.messageName;
              $scope.emailComposer.subject = messageInfo.subject;
              $scope.emailComposer.prepend_salutation = messageInfo.prependsalutation === 'true';
              messageBody = messageInfo.messageBody;
              return setEmailMessageBody(messageBody);
            }
          }
        });
      } else if ($scope.messageType === 'group' && $scope.messageId) {
        if (contactFilters.indexOf($scope.messageId !== -1)) {
          ContactService.resetSelectedContacts();
          $scope.getGroupRecipientsPage = 0;
          $scope.getGroupRecipients = function() {
            var contactsPromise;
            contactsPromise = ContactService.getTeamraiserAddressBookContacts('tr_ab_filter=' + $scope.messageId + '&skip_groups=true&list_page_size=200&list_page_offset=' + $scope.getGroupRecipientsPage).then(function(response) {
              var addressBookContacts, totalNumber;
              totalNumber = response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults;
              addressBookContacts = response.data.getTeamraiserAddressBookContactsResponse.addressBookContact;
              if (!angular.isArray(addressBookContacts)) {
                addressBookContacts = [addressBookContacts];
              }
              angular.forEach(addressBookContacts, function(contact) {
                if (contact != null) {
                  return ContactService.addToSelectedContacts(contact);
                }
              });
              if (totalNumber > ContactService.getNumSelectedContacts()) {
                $scope.getGroupRecipientsPage = $scope.getGroupRecipientsPage + 1;
                $scope.getGroupRecipients();
              } else {
                $scope.messageId = '';
                setEmailComposerDefaults();
              }
              return response;
            });
            return $scope.emailPromises.push(contactsPromise);
          };
          $scope.getGroupRecipients();
        }
      }
      personalizedGreetingEnabledPromise = TeamraiserEventService.getEventDataParameter('edp_type=boolean&edp_name=F2F_CENTER_TAF_PERSONALIZED_SALUTATION_ENABLED').then(function(response) {
        $scope.personalizedSalutationEnabled = response.data.getEventDataParameterResponse.booleanValue === 'true';
        $translate('compose_salutation_hint').then(function(translation) {
          var content;
          if (translation != null ? translation.match(/\([^]*\)/) : void 0) {
            content = translation.split('(');
            $scope.composeSalutationHintLabel = content[0];
            return $scope.composeSalutationWhatsThis = content[1].split(')')[0];
          } else {
            $scope.composeSalutationHintLabel = translation;
            return $scope.composeSalutationWhatsThis = null;
          }
        }, function(translationIds) {
          $scope.composeSalutationHintLabel = 'Include personalized greeting';
          return $scope.composeSalutationWhatsThis = "What's this?";
        });
        $scope.personalizedSalutationHintUrl = 'http://help.convio.net/site/PageServer?s_site=' + $rootScope.siteShortname + '&pagename=WhatsThis_TAFPersonalizedGreeting';
        return response;
      });
      $scope.emailPromises.push(personalizedGreetingEnabledPromise);
      $scope.loadSuggestedMessage = function() {
        var suggested_message_id;
        $scope.resetEmailComposeAlerts();
        suggested_message_id = $scope.emailComposer.suggested_message_id;
        if (suggested_message_id === '' || suggested_message_id === null) {
          return setEmailComposerDefaults();
        } else {
          return TeamraiserEmailService.getSuggestedMessage('message_id=' + suggested_message_id).then(function(response) {
            var messageBody, messageInfo, ref1;
            setEmailComposerDefaults();
            messageInfo = (ref1 = response.data.getSuggestedMessageResponse) != null ? ref1.messageInfo : void 0;
            $scope.emailComposer.suggested_message_id = messageInfo.messageId;
            $scope.emailComposer.subject = messageInfo.subject;
            if ($scope.suggestedMessageTemplates.indexOf(messageInfo.messageId) > -1) {
              $scope.emailComposer.save_template_id = messageInfo.messageId;
            } else {
              $scope.emailComposer.save_template_id = '';
            }
            messageBody = messageInfo.messageBody;
            return setEmailMessageBody(messageBody);
          });
        }
      };
      $scope.textEditorToolbar = [['h1', 'h2', 'h3', 'p', 'bold', 'italics', 'underline'], ['ul', 'ol', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'], ['insertImage', 'insertLink', 'undo', 'redo']];
      sanitizeEmailComposer = function() {
        var emailComposer;
        emailComposer = angular.copy($scope.emailComposer);
        emailComposer.message_body = getEmailMessageBody();
        emailComposer.message_name = emailComposer.subject;
        delete emailComposer.just_updated;
        delete emailComposer.suggested_message_id;
        delete emailComposer.save_template_id;
        return $httpParamSerializer(emailComposer);
      };
      saveDraft = function() {
        var requestData;
        requestData = sanitizeEmailComposer();
        if ($scope.emailComposer.message_id === '') {
          return TeamraiserEmailService.addDraft(requestData).then(function(response) {
            var draftMessage, messageId, ref1, ref2;
            if (((ref1 = response.data.errorResponse) != null ? ref1.message : void 0) && $scope.emailComposer.save_template) {
              $scope.saveDraftError = response.data.errorResponse.message;
            }
            draftMessage = (ref2 = response.data.addDraftResponse) != null ? ref2.message : void 0;
            if (draftMessage) {
              refreshContactsNavBar();
              messageId = draftMessage.messageId;
              $scope.messageId = messageId;
              $scope.emailComposer.message_name = draftMessage.messageName;
              $scope.emailComposer.message_id = messageId;
              if ($scope.emailComposer.save_template) {
                $scope.saveDraftSuccess = true;
                $scope.emailComposer.suggested_message_id = messageId;
                $scope.emailComposer.save_template_id = messageId;
                $scope.emailComposer.message_id = '';
                getSuggestedMessages();
              }
            }
            $scope.emailComposer.save_template = false;
            return response;
          });
        } else {
          return TeamraiserEmailService.updateDraft(requestData).then(function(response) {
            var draftMessage, messageId, ref1, ref2, ref3;
            if (((ref1 = response.data.errorResponse) != null ? ref1.code : void 0) === '2647') {
              TeamraiserEmailService.deleteDraft('message_id=' + $scope.emailComposer.message_id).then(function(response) {
                $scope.emailComposer.message_id = '';
                return saveDraft();
              });
            }
            if (((ref2 = response.data.errorResponse) != null ? ref2.message : void 0) && $scope.emailComposer.save_template) {
              $scope.saveDraftError = response.data.errorResponse.message;
            }
            draftMessage = (ref3 = response.data.updateDraftResponse) != null ? ref3.message : void 0;
            if (draftMessage) {
              messageId = draftMessage.messageId;
              if ($scope.emailComposer.save_template) {
                $scope.saveDraftSuccess = true;
                $scope.emailComposer.suggested_message_id = messageId;
                $scope.emailComposer.save_template_id = messageId;
                $scope.emailComposer.message_id = '';
                getSuggestedMessages();
              }
            }
            $scope.emailComposer.save_template = false;
            return response;
          });
        }
      };
      $scope.$watchGroup(['emailComposer.subject', 'emailComposer.message_body'], function() {
        var cancelDraftPollTimeout, messageBody, subject;
        subject = $scope.emailComposer.subject;
        messageBody = getEmailMessageBody();
        cancelDraftPollTimeout = function() {
          if ($scope.draftPollTimeout) {
            $timeout.cancel($scope.draftPollTimeout);
            return delete $scope.draftPollTimeout;
          }
        };
        if ($scope.emailComposer.just_updated) {
          $scope.emailComposer.just_updated = false;
          return cancelDraftPollTimeout();
        } else if (subject === '' && messageBody === '') {
          return cancelDraftPollTimeout();
        } else {
          cancelDraftPollTimeout();
          $scope.emailComposer.save_template = false;
          saveDraft();
          return $scope.draftPollTimeout = $timeout(saveDraft, 3000);
        }
      });
      $scope.saveAsTemplate = function() {
        $scope.resetEmailComposeAlerts();
        $scope.emailComposer.save_template = true;
        $scope.emailComposer.save_template_id = $scope.emailComposer.message_id;
        $scope.emailComposer.message_id = '';
        $scope.emailComposer.message_name = $scope.emailComposer.subject;
        return saveDraft();
      };
      $scope.updateTemplate = function() {
        $scope.resetEmailComposeAlerts();
        $scope.emailComposer.save_template = true;
        $scope.emailComposer.message_id = $scope.emailComposer.save_template_id;
        $scope.emailComposer.message_name = $scope.emailComposer.subject;
        return saveDraft();
      };
      $scope.deleteTemplate = function() {
        var currentMessageId, deleteDraftPromise;
        if ($scope.emailComposer.save_template_id) {
          $scope.resetEmailComposeAlerts();
          currentMessageId = $scope.emailComposer.save_template_id;
          deleteDraftPromise = TeamraiserEmailService.deleteDraft('message_id=' + currentMessageId).then(function(response) {
            var ref1, ref2, ref3;
            if ((ref1 = response.data) != null ? (ref2 = ref1.deleteDraftResponse) != null ? ref2.messageId : void 0 : void 0) {
              $scope.deleteDraftSuccess = true;
            } else if ((ref3 = response.data.errorResponse) != null ? ref3.message : void 0) {
              $scope.deleteDraftError = response.data.errorResponse.message;
            } else {
              $translate('message_template_delete_error_unknown').then(function(translation) {
                return $scope.deleteDraftError = translation;
              }, function(translationId) {
                return $scope.deleteDraftError = translationId;
              });
            }
            refreshContactsNavBar();
            setEmailComposerDefaults();
            return getSuggestedMessages();
          });
          return $scope.emailPromises.push(deleteDraftPromise);
        }
      };
      $scope.emailPreview = {
        body: ''
      };
      $scope.selectStationeryEnabled = false;
      $scope.stationeryChoices = [];
      getMessageLayoutsPromise = TeamraiserEmailService.getMessageLayouts().then(function(response) {
        var layouts, ref1;
        if (response.data.errorResponse) {

        } else {
          layouts = (ref1 = response.data.getMessageLayoutsResponse) != null ? ref1.layout : void 0;
          if (layouts) {
            if (!angular.isArray(layouts)) {
              layouts = [layouts];
            }
            $scope.stationeryChoices = layouts;
            return $scope.selectStationeryEnabled = true;
          }
        }
      });
      $scope.emailPromises.push(getMessageLayoutsPromise);
      $scope.selectStationery = function() {
        var requestData;
        requestData = sanitizeEmailComposer();
        TeamraiserEmailService.previewMessage(requestData).then(function(response) {
          var ref1;
          if (response.data.errorResponse) {

          } else if (response.data.teamraiserErrorResponse) {

          } else {
            return $scope.emailPreview.body = $sce.trustAsHtml(((ref1 = response.data.getMessagePreviewResponse) != null ? ref1.message : void 0) || '');
          }
        });
        return $scope.emailPromises.push(selectStationeryPromise);
      };
      $scope.previewEmail = function() {
        var previewMessagePromise, requestData;
        $scope.resetEmailComposeAlerts();
        requestData = sanitizeEmailComposer();
        previewMessagePromise = TeamraiserEmailService.previewMessage(requestData).then(function(response) {
          var ref1;
          if (response.data.errorResponse) {
            return $scope.sendEmailError = response.data.errorResponse.message;
          } else if (response.data.teamraiserErrorResponse) {

          } else {
            $scope.emailPreview.body = $sce.trustAsHtml(((ref1 = response.data.getMessagePreviewResponse) != null ? ref1.message : void 0) || '');
            return $scope.emailPreviewModal = $uibModal.open({
              scope: $scope,
              templateUrl: APP_INFO.rootPath + 'html/modal/emailPreview.html',
              size: 'lg'
            });
          }
        });
        return $scope.emailPromises.push(previewMessagePromise);
      };
      closeEmailPreviewModal = function() {
        return $scope.emailPreviewModal.close();
      };
      $scope.cancelEmailPreview = function() {
        return closeEmailPreviewModal();
      };
      return $scope.sendEmail = function() {
        var requestData, sendEmailPromise;
        if (!$scope.sendingEmail) {
          $scope.sendingEmail = true;
          $scope.resetEmailComposeAlerts();
          requestData = sanitizeEmailComposer();
          sendEmailPromise = TeamraiserEmailService.sendMessage(requestData).then(function(response) {
            var deleteDraftPromise;
            closeEmailPreviewModal();
            $scope.sendingEmail = false;
            $rootScope.scrollToTop();
            if (response.data.errorResponse) {
              return $scope.sendEmailError = response.data.errorResponse.message;
            } else if (response.data.teamraiserErrorResponse) {

            } else {
              if ($scope.messageId) {
                deleteDraftPromise = TeamraiserEmailService.deleteDraft('message_id=' + $scope.messageId).then(function(response) {
                  return refreshContactsNavBar();
                });
                $scope.emailPromises.push(deleteDraftPromise);
              }
              refreshContactsNavBar();
              $scope.sendEmailSuccess = true;
              ContactService.resetSelectedContacts();
              return setEmailComposerDefaults();
            }
          });
          return $scope.emailPromises.push(sendEmailPromise);
        } else {
          return $scope.sendingEmail = false;
        }
      };
    }
  ]);

  angular.module('trPcControllers').controller('EmailContactsListViewCtrl', [
    '$rootScope', '$scope', '$window', '$timeout', '$routeParams', '$location', '$httpParamSerializer', '$translate', '$filter', '$uibModal', 'TeamraiserEmailService', 'ContactService', 'APP_INFO', function($rootScope, $scope, $window, $timeout, $routeParams, $location, $httpParamSerializer, $translate, $filter, $uibModal, TeamraiserEmailService, ContactService, APP_INFO) {
      var closeAddContactModal, closeDeleteContactModal, closeEditContactModal, closeImportContactsModal, emailAllButtonKey, getContactById, getContactsTotal, getImportContactString, openDeleteContactModal, ref, refreshContactsNavBar, showDeleteContactError, updateContactFilterNames;
      $scope.filter = $routeParams.filter;
      if (!$scope.filter || $scope.filter === ':filter') {
        $scope.filter = 'email_rpt_show_all';
      }
      $scope.refreshContactsNav = 0;
      $scope.emailPromises = [];
      getContactById = function(contactId) {
        var contact;
        contact = null;
        if ($scope.addressBookContacts.contacts.length > 0) {
          angular.forEach($scope.addressBookContacts.contacts, function(currContact) {
            if (currContact.id === contactId) {
              return contact = currContact;
            }
          });
        }
        return contact;
      };
      if (!((ref = $rootScope.selectedContacts) != null ? ref.contacts : void 0)) {
        ContactService.resetSelectedContacts();
      }
      $scope.addressBookNumPerPageOptions = [10, 25, 50, 100, 500];
      $scope.addressBookContacts = {
        page: 1,
        numPerPage: 10,
        maxContacts: 0,
        totalNumber: 0,
        searching: false,
        contacts: [],
        contactSearchInput: ''
      };
      $scope.addressBookGroups = [];
      $scope.contactSearchInput = '';
      $scope.allContactsSelected = false;
      $scope.contactsSelected = {
        all: function(newVal) {
          if (arguments.length) {
            return $scope.allContactsSelected = newVal;
          } else {
            return $scope.allContactsSelected;
          }
        }
      };
      $scope.contactsUpdated = false;
      getContactsTotal = function() {
        var getContactsTotalPromise;
        getContactsTotalPromise = ContactService.getTeamraiserAddressBookContacts('tr_ab_filter=email_rpt_show_all&skip_groups=true&list_page_size=10&list_page_offset=0').then(function(response) {
          var ref1;
          $scope.addressBookContacts.maxContacts = (ref1 = response.data.getTeamraiserAddressBookContactsResponse) != null ? ref1.totalNumberResults : void 0;
          return response;
        });
        return $scope.emailPromises.push(getContactsTotalPromise);
      };
      getContactsTotal();
      refreshContactsNavBar = function() {
        getContactsTotal();
        return $scope.refreshContactsNav = $scope.refreshContactsNav + 1;
      };
      $scope.refreshSelectedContacts = function() {
        if ($scope.addressBookContacts.contacts && $scope.addressBookContacts.contacts.length > 0) {
          $scope.numContactsSelected = $filter('filter')($scope.addressBookContacts.contacts, {
            selected: true
          }).length;
          $scope.contactsSelected.all($scope.numContactsSelected === $scope.addressBookContacts.contacts.length);
        } else {
          $scope.numContactsSelected = 0;
          $scope.contactsSelected.all(false);
        }
        return $scope.contactsSelected.all();
      };
      $scope.refreshSelectedContacts();
      $scope.$watchGroup(['addressBookContacts.contacts', 'contactsUpdated'], function() {
        return $scope.refreshSelectedContacts();
      });
      $scope.getContacts = function() {
        var contactsPromise, numPerPage, pageNumber, requestData;
        pageNumber = $scope.addressBookContacts.page - 1;
        numPerPage = $scope.addressBookContacts.numPerPage;
        requestData = 'tr_ab_filter=' + $scope.filter + '&skip_groups=true&list_page_size=' + numPerPage + '&list_page_offset=' + pageNumber;
        if ($scope.contactSearchInput !== '') {
          requestData += '&list_filter_text=' + $scope.contactSearchInput;
        }
        contactsPromise = ContactService.getTeamraiserAddressBookContacts(requestData).then(function(response) {
          var addressBookContacts;
          addressBookContacts = response.data.getTeamraiserAddressBookContactsResponse.addressBookContact;
          if (!angular.isArray(addressBookContacts)) {
            addressBookContacts = [addressBookContacts];
          }
          $scope.addressBookContacts.contacts = [];
          angular.forEach(addressBookContacts, function(contact) {
            if (contact) {
              contact.selected = ContactService.isInSelectedContacts(contact);
              return $scope.addressBookContacts.contacts.push(contact);
            }
          });
          $scope.addressBookContacts.totalNumber = response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults;
          return response;
        });
        return $scope.emailPromises.push(contactsPromise);
      };
      $scope.getContacts();
      $scope.showDeleteGroup = false;
      $scope.getGroups = function() {
        var getGroupsPromise;
        getGroupsPromise = ContactService.getAddressBookGroups().then(function(response) {
          var abgroups, ref1;
          abgroups = (ref1 = response.data.getAddressBookGroupsResponse) != null ? ref1.group : void 0;
          if (!angular.isArray(abgroups)) {
            abgroups = [abgroups];
          }
          $scope.showDeleteGroup = false;
          angular.forEach(abgroups, function(group) {
            var filter;
            if (group) {
              filter = 'email_rpt_group_' + group.id;
              if ($scope.filter === filter) {
                $scope.filterName = group.name;
                return $scope.showDeleteGroup = true;
              }
            }
          });
          $scope.addressBookGroups = abgroups;
          return response;
        });
        return $scope.emailPromises.push(getGroupsPromise);
      };
      updateContactFilterNames = function() {
        if ($scope.updateContactFilterNamesTimeout) {
          $timeout.cancel($scope.updateContactFilterNamesTimeout);
        }
        if ($scope.filter === 'email_rpt_show_all') {
          return $translate('contacts_groups_all').then(function(translation) {
            return $scope.filterName = translation;
          }, function(translationId) {
            return $scope.updateContactFilterNamesTimeout = $timeout(updateContactFilterNames, 500);
          });
        } else if ($scope.filter.match('email_rpt_group_')) {
          return $scope.getGroups();
        } else {
          return $translate('filter_' + $scope.filter).then(function(translation) {
            return $scope.filterName = translation;
          }, function(translationId) {
            return $scope.updateContactFilterNamesTimeout = $timeout(updateContactFilterNames, 500);
          });
        }
      };
      updateContactFilterNames();
      $scope.searchContacts = function() {
        $scope.addressBookContacts.page = 1;
        $scope.getContacts();
        return false;
      };
      $scope.clearAllContactAlerts = function() {
        $scope.clearAddContactAlerts();
        $scope.clearImportContactsAlerts();
        $scope.clearEditContactAlerts();
        return $scope.clearDeleteContactAlerts();
      };
      $scope.clearAddContactAlerts = function() {
        if ($scope.addContactError) {
          delete $scope.addContactError;
        }
        if ($scope.addContactSuccess) {
          return delete $scope.addContactSuccess;
        }
      };
      $scope.resetNewContact = function() {
        return $scope.newContact = {
          first_name: '',
          last_name: '',
          email: ''
        };
      };
      $scope.addContact = function() {
        $scope.clearAllContactAlerts();
        $scope.resetNewContact();
        return $scope.addContactModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/addContact.html'
        });
      };
      closeAddContactModal = function() {
        return $scope.addContactModal.close();
      };
      $scope.cancelAddContact = function() {
        $scope.clearAddContactAlerts();
        return closeAddContactModal();
      };
      $scope.addNewContact = function() {
        var addContactPromise;
        $scope.clearAddContactAlerts();
        if (!$scope.newContact.email || $scope.newContact.email === '') {
          return $translate('contact_add_failure_email').then(function(translation) {
            return $scope.addContactError = translation;
          }, function(translationId) {
            return $scope.addContactError = translationId;
          });
        } else {
          addContactPromise = ContactService.addAddressBookContact($httpParamSerializer($scope.newContact)).then(function(response) {
            if (response.data.errorResponse) {
              if (response.data.errorResponse.message) {
                $scope.addContactError = response.data.errorResponse.message;
              } else {
                $translate('contact_add_failure_unknown').then(function(translation) {
                  return $scope.addContactError = translation;
                }, function(translationId) {
                  return $scope.addContactError = translationId;
                });
              }
            } else {
              $translate('contact_add_success').then(function(translation) {
                return $scope.addContactSuccess = translation;
              }, function(translationId) {
                return $scope.addContactSuccess = translationId;
              });
              closeAddContactModal();
              refreshContactsNavBar();
              $scope.getContacts();
            }
            return response;
          });
          return $scope.emailPromises.push(addContactPromise);
        }
      };
      $scope.resetAddContactsToGroup = function() {
        $scope.addContactGroupForm = {
          groupId: '',
          groupName: '',
          errorMsg: null
        };
        if ($scope.addressBookGroups.length === 0) {
          return $scope.getGroups();
        }
      };
      $scope.addContactsToGroup = function() {
        var selectedContacts;
        $scope.resetAddContactsToGroup();
        selectedContacts = [];
        angular.forEach($scope.addressBookContacts.contacts, function(contact) {
          if (contact != null ? contact.selected : void 0) {
            return selectedContacts.push(contact.id);
          }
        });
        $scope.addContactGroupForm.contactIds = selectedContacts.join(',');
        return $scope.addContactsToGroupModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/addContactsToGroup.html'
        });
      };
      $scope.cancelAddContactsToGroup = function() {
        return $scope.addContactsToGroupModal.close();
      };
      $scope.confirmAddContactsToGroup = function() {
        var addContactGroupPromise, dataStr;
        delete $scope.addContactGroupForm.errorMsg;
        if ($scope.addContactGroupForm.groupId === '' && $scope.addContactGroupForm.groupName === '') {
          return $translate('contact_add_to_group_warning').then(function(translation) {
            return $scope.addContactGroupForm.errorMsg = translation;
          }, function(translationId) {
            return $scope.addContactGroupForm.errorMsg = translationId;
          });
        } else {
          if ($scope.addContactGroupForm.groupName !== '') {
            dataStr = 'group_name=' + encodeURIComponent($scope.addContactGroupForm.groupName) + '&contact_ids=' + $scope.addContactGroupForm.contactIds;
            addContactGroupPromise = ContactService.addAddressBookGroup(dataStr).then(function(response) {
              if (response.data.errorResponse) {
                if (response.data.errorResponse.message) {
                  $scope.addContactGroupForm.errorMsg = response.data.errorResponse.message;
                } else {
                  $translate('contact_add_to_group_unknown_error').then(function(translation) {
                    return $scope.addContactGroupForm.errorMsg = translation;
                  }, function(translationId) {
                    return $scope.addContactGroupForm.errorMsg = translationId;
                  });
                }
              } else {
                refreshContactsNavBar();
                $scope.cancelAddContactsToGroup();
              }
              return response;
            });
            return $scope.emailPromises.push(addContactGroupPromise);
          } else {
            dataStr = 'group_id=' + $scope.addContactGroupForm.groupId + '&contact_ids=' + $scope.addContactGroupForm.contactIds;
            addContactGroupPromise = ContactService.addContactsToGroup(dataStr).then(function(response) {
              if (response.data.errorResponse) {
                if (response.data.errorResponse.message) {
                  $scope.addContactGroupForm.errorMsg = response.data.errorResponse.message;
                } else {
                  $translate('contact_add_to_group_unknown_error').then(function(translation) {
                    return $scope.addContactGroupForm.errorMsg = translation;
                  }, function(translationId) {
                    return $scope.addContactGroupForm.errorMsg = translationId;
                  });
                }
              } else {
                refreshContactsNavBar();
                $scope.cancelAddContactsToGroup();
              }
              return response;
            });
            return $scope.emailPromises.push(addContactGroupPromise);
          }
        }
      };
      $scope.deleteContactGroup = function() {
        delete $scope.deleteContactGroupError;
        $scope.deleteContactGroupId = $scope.filter.replace('email_rpt_group_', '');
        return $scope.deleteContactGroupModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/deleteContactGroup.html'
        });
      };
      $scope.cancelDeleteContactGroup = function() {
        delete $scope.deleteContactGroupError;
        delete $scope.deleteContactGroupId;
        return $scope.deleteContactGroupModal.close();
      };
      $scope.confirmDeleteContactGroup = function() {
        var deleteContactGroupPromise;
        deleteContactGroupPromise = ContactService.deleteAddressBookGroups('group_ids=' + $scope.deleteContactGroupId).then(function(response) {
          if (response.data.errorResponse) {
            if (response.data.errorResponse.message) {
              return $scope.deleteContactGroupError = response.data.errorResponse.message;
            } else {
              return $translate('contact_delete_group_unknown_error').then(function(translation) {
                return $scope.deleteContactGroupError = translation;
              }, function(translationId) {
                return $scope.deleteContactGroupError = translationId;
              });
            }
          } else {
            $scope.cancelDeleteContactGroup();
            return $location.path('/email/contacts');
          }
        });
        return $scope.emailPromises.push(deleteContactGroupPromise);
      };
      $scope.clearImportContactsAlerts = function() {
        if ($scope.importContactsError) {
          delete $scope.importContactsError;
        }
        if ($scope.importContactsSuccess) {
          return delete $scope.importContactsSuccess;
        }
      };
      $scope.resetImportContacts = function() {
        $scope.contactImport = {
          step: 'choose-type',
          import_type: '',
          jobEvents: [],
          contactsToAdd: []
        };
        return $translate('contact_import_consent_needed').then(function(translation) {
          $scope.contactImport.jobEvents = [];
          return $scope.contactImport.jobEvents.push({
            message: translation
          });
        }, function(translationId) {
          $scope.contactImport.jobEvents = [];
          return $scope.contactImport.jobEvents.push({
            message: translationId
          });
        });
      };
      $scope.importContacts = function() {
        $scope.clearAllContactAlerts();
        $scope.resetImportContacts();
        return $scope.importContactsModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/importContacts.html'
        });
      };
      closeImportContactsModal = function() {
        return $scope.importContactsModal.close();
      };
      $scope.cancelImportContacts = function() {
        $scope.clearImportContactsAlerts();
        return closeImportContactsModal();
      };
      $scope.chooseImportContactType = function() {
        var importType;
        importType = $scope.contactImport.import_type;
        if (!importType || importType === '') {

        } else {
          if (importType === 'csv') {
            return $scope.contactImport.step = 'csv-upload';
          } else {
            $scope.contactImport.step = 'online-consent';
            $window.open(APP_INFO.rootPath + 'html/popup/address-book-import.html?import_source=' + $scope.contactImport.import_type, 'startimport', 'location=no,menubar=no,toolbar=no,height=400');
            return false;
          }
        }
      };
      window.trPcContactImport = {
        buildAddressBookImport: function(importJobId) {
          return ContactService.getAddressBookImportJobStatus('import_job_id=' + importJobId).then(function(response) {
            var events, jobEvents, jobStatus, ref1, ref2;
            if (response.data.errorResponse) {

            } else {
              jobStatus = (ref1 = response.data.getAddressBookImportJobStatusResponse) != null ? ref1.jobStatus : void 0;
              if (!jobStatus) {

              } else {
                if (jobStatus === 'PENDING') {
                  events = (ref2 = response.data.getAddressBookImportJobStatusResponse.events) != null ? ref2.event : void 0;
                  if (!events) {
                    $scope.updateImportJobEvents();
                  } else {
                    if (!angular.isArray(events)) {
                      events = [events];
                    }
                    jobEvents = [];
                    angular.forEach(events, function(event) {
                      return jobEvents.push({
                        message: event
                      });
                    });
                    $scope.updateImportJobEvents(jobEvents);
                  }
                  return trPcContactImport.buildAddressBookImport(importJobId);
                } else if (jobStatus === 'SUCCESS') {
                  return ContactService.getAddressBookImportContacts('import_job_id=' + importJobId).then(function(response) {
                    var contacts, contactsAvailableForImport, ref3;
                    if (response.data.errorResponse) {

                    } else {
                      contacts = (ref3 = response.data.getAddressBookImportContactsResponse) != null ? ref3.contact : void 0;
                      if (!contacts) {
                        return $scope.setContactsAvailableForImport();
                      } else {
                        if (!angular.isArray(contacts)) {
                          contacts = [contacts];
                        }
                        contactsAvailableForImport = [];
                        angular.forEach(contacts, function(contact) {
                          var email, firstName, lastName;
                          firstName = contact.firstName;
                          lastName = contact.lastName;
                          email = contact.email;
                          if (firstName && !angular.isString(firstName)) {
                            delete contact.firstName;
                          }
                          if (lastName && !angular.isString(lastName)) {
                            delete contact.lastName;
                          }
                          if (email && !angular.isString(email)) {
                            delete contact.email;
                          }
                          return contactsAvailableForImport.push(contact);
                        });
                        return $scope.setContactsAvailableForImport(contactsAvailableForImport);
                      }
                    }
                  });
                }
              }
            }
          });
        }
      };
      getImportContactString = function(contact) {
        var contactData;
        contactData = '';
        if (contact.firstName) {
          contactData += '"' + contact.firstName + '"';
        }
        contactData += ', ';
        if (contact.lastName) {
          contactData += '"' + contact.lastName + '"';
        }
        contactData += ', ';
        if (contact.email) {
          contactData += '"' + contact.email + '"';
        }
        return contactData;
      };
      $scope.updateImportJobEvents = function(jobEvents) {
        if (jobEvents && jobEvents.length !== 0) {
          $scope.contactImport.jobEvents = jobEvents;
        }
        if (!$scope.$$phase) {
          return $scope.$apply();
        }
      };
      $scope.setContactsAvailableForImport = function(contactsAvailableForImport) {
        $scope.contactImport.step = 'contacts-available-for-import';
        $scope.contactsAvailableForImport = contactsAvailableForImport || [];
        if (!$scope.$$phase) {
          return $scope.$apply();
        }
      };
      $scope.selectAllContactsToAdd = function($event) {
        var contactsAvailableForImport;
        if ($event) {
          $event.preventDefault();
        }
        contactsAvailableForImport = [];
        $scope.contactImport.contactsToAdd = [];
        angular.forEach($scope.contactsAvailableForImport, function(contactAvailableForImport) {
          contactAvailableForImport.selected = true;
          contactsAvailableForImport.push(contactAvailableForImport);
          return $scope.contactImport.contactsToAdd.push(getImportContactString(contactAvailableForImport));
        });
        return $scope.contactsAvailableForImport = contactsAvailableForImport;
      };
      $scope.deselectAllContactsToAdd = function($event) {
        var contactsAvailableForImport;
        if ($event) {
          $event.preventDefault();
        }
        contactsAvailableForImport = [];
        angular.forEach($scope.contactsAvailableForImport, function(contactAvailableForImport) {
          contactAvailableForImport.selected = false;
          return contactsAvailableForImport.push(contactAvailableForImport);
        });
        $scope.contactsAvailableForImport = contactsAvailableForImport;
        return $scope.contactImport.contactsToAdd = [];
      };
      $scope.toggleContactToAdd = function(contact) {
        var contactToAddIndex;
        contactToAddIndex = $scope.contactImport.contactsToAdd.indexOf(getImportContactString(contact));
        if (contactToAddIndex === -1) {
          return $scope.contactImport.contactsToAdd.push(contactData);
        } else {
          return $scope.contactImport.contactsToAdd.splice(contactToAddIndex, 1);
        }
      };
      $scope.chooseContactsToImport = function() {
        $scope.clearImportContactsAlerts();
        if ($scope.contactImport.contactsToAdd.length === 0) {
          return $translate('addressbookimport_selectcontacts_none_selected_failure').then(function(translation) {
            return $scope.importContactsError = translation;
          }, function(translationId) {
            return $scope.importContactsError = translationId;
          });
        } else {
          return ContactService.importAddressBookContacts('contacts_to_add=' + encodeURIComponent($scope.contactImport.contactsToAdd.join('\n'))).then(function(response) {
            var duplicateContacts, errorContacts, potentialDuplicateContacts, ref1, ref2, ref3, ref4, savedContacts;
            if (response.data.errorResponse) {
              return $scope.importContactsError = response.data.errorResponse.message;
            } else {
              errorContacts = (ref1 = response.data.importAddressBookContactsResponse) != null ? ref1.errorContact : void 0;
              if (errorContacts) {
                if (!angular.isArray(errorContacts)) {
                  errorContacts = [errorContacts];
                }
              }
              potentialDuplicateContacts = (ref2 = response.data.importAddressBookContactsResponse) != null ? ref2.potentialDuplicateContact : void 0;
              if (potentialDuplicateContacts) {
                if (!angular.isArray(potentialDuplicateContacts)) {
                  potentialDuplicateContacts = [potentialDuplicateContacts];
                }
              }
              duplicateContacts = (ref3 = response.data.importAddressBookContactsResponse) != null ? ref3.duplicateContact : void 0;
              if (duplicateContacts) {
                if (!angular.isArray(duplicateContacts)) {
                  duplicateContacts = [duplicateContacts];
                }
              }
              savedContacts = (ref4 = response.data.importAddressBookContactsResponse) != null ? ref4.savedContact : void 0;
              if (savedContacts) {
                if (!angular.isArray(savedContacts)) {
                  savedContacts = [savedContacts];
                }
              }
              $scope.importContactsSuccess = true;
              closeImportContactsModal();
              refreshContactsNavBar();
              return $scope.getContacts();
            }
          });
        }
      };
      $scope.uploadContactsCSV = function() {
        angular.element(document).find('.js--import-contacts-csv-form').submit();
        return false;
      };
      $scope.handleContactsCSV = function(csvIframe) {
        var confidenceLevel, contactsAvailableForImport, csvDataRows, csvIframeContent, csvIframeJSON, emailColumnIndex, firstNameColumnIndex, lastNameColumnIndex, proposedMapping, ref1, ref2, ref3, ref4;
        csvIframeContent = jQuery(csvIframe).contents().text();
        if (csvIframeContent) {
          csvIframeJSON = jQuery.parseJSON(csvIframeContent);
          if (csvIframeJSON.errorResponse) {

          } else {
            confidenceLevel = (ref1 = csvIframeJSON.parseCsvContactsResponse) != null ? ref1.confidenceLevel : void 0;
            proposedMapping = (ref2 = csvIframeJSON.parseCsvContactsResponse) != null ? ref2.proposedMapping : void 0;
            if (proposedMapping) {
              firstNameColumnIndex = Number(proposedMapping.firstNameColumnIndex);
              lastNameColumnIndex = Number(proposedMapping.lastNameColumnIndex);
              emailColumnIndex = Number(proposedMapping.emailColumnIndex);
              csvDataRows = (ref3 = csvIframeJSON.parseCsvContactsResponse) != null ? (ref4 = ref3.csvDataRows) != null ? ref4.csvDataRow : void 0 : void 0;
              if (!csvDataRows) {

              } else {
                if (!angular.isArray(csvDataRows)) {
                  csvDataRows = [csvDataRows];
                }
                contactsAvailableForImport = [];
                angular.forEach(csvDataRows, function(csvDataRow) {
                  var contact, csvValue, email, firstName, lastName;
                  csvValue = csvDataRow.csvValue;
                  firstName = csvValue[firstNameColumnIndex];
                  lastName = csvValue[lastNameColumnIndex];
                  email = csvValue[emailColumnIndex];
                  contact = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                  };
                  if (firstName && !angular.isString(firstName)) {
                    delete contact.firstName;
                  }
                  if (lastName && !angular.isString(lastName)) {
                    delete contact.lastName;
                  }
                  if (email && !angular.isString(email)) {
                    delete contact.email;
                  }
                  return contactsAvailableForImport.push(contact);
                });
                return $scope.setContactsAvailableForImport(contactsAvailableForImport);
              }
            }
          }
        }
      };
      $scope.toggleContact = function(contactId) {
        var contact, contactSelected;
        contact = getContactById(contactId);
        contactSelected = ContactService.isInSelectedContacts(contact);
        if (!contactSelected) {
          contact.selected = true;
          ContactService.addToSelectedContacts(contact);
        } else {
          contact.selected = false;
          ContactService.removeFromSelectedContacts(contact);
        }
        return $scope.contactsUpdated = !$scope.contactsUpdated;
      };
      $scope.toggleAllContacts = function() {
        var selectToggle;
        selectToggle = $scope.contactsSelected.all();
        angular.forEach($scope.addressBookContacts.contacts, function(contact) {
          if (contact.selected !== selectToggle) {
            return $scope.toggleContact(contact.id);
          }
        });
        return $scope.contactsSelected.all(selectToggle);
      };
      $scope.clearEditContactAlerts = function() {
        if ($scope.editContactError) {
          delete $scope.editContactError;
        }
        if ($scope.editContactSuccess) {
          return delete $scope.editContactSuccess;
        }
      };
      $scope.selectContact = function(contactId) {
        var contact;
        $scope.clearAllContactAlerts();
        contact = getContactById(contactId);
        $scope.editContactMode = false;
        $scope.viewContact = angular.copy(contact);
        $scope.updatedContact = {
          contact_id: contact.id,
          first_name: contact.firstName,
          last_name: contact.lastName,
          email: contact.email,
          street1: contact.street1,
          street2: contact.street2,
          city: contact.city,
          state: contact.state,
          zip: contact.zip,
          country: contact.country
        };
        return $scope.editContactModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/editContact.html'
        });
      };
      closeEditContactModal = function() {
        return $scope.editContactModal.close();
      };
      $scope.cancelEditContact = function() {
        delete $scope.editContactMode;
        delete $scope.viewContact;
        delete $scope.updatedContact;
        $scope.clearEditContactAlerts();
        return closeEditContactModal();
      };
      $scope.toggleEditContact = function() {
        return $scope.editContactMode = !$scope.editContactMode;
      };
      $scope.saveUpdatedContact = function() {
        var updateContactPromise;
        $scope.clearEditContactAlerts();
        if (!$scope.updatedContact) {

        } else {
          updateContactPromise = ContactService.updateTeamraiserAddressBookContact($httpParamSerializer($scope.updatedContact)).then(function(response) {
            if (response.data.errorResponse) {
              if (response.data.errorResponse.message) {
                $scope.editContactError = response.data.errorResponse.message;
              } else {
                $translate('contact_add_failure_unknown').then(function(translation) {
                  return $scope.editContactError = translation;
                }, function(translationId) {
                  return $scope.editContactError = translationId;
                });
              }
            } else {
              $translate('contact_edit_success').then(function(translation) {
                return $scope.editContactSuccess = translation;
              }, function(translationId) {
                return $scope.editContactSuccess = translation;
              });
              closeEditContactModal();
              $rootScope.scrollToTop();
              refreshContactsNavBar();
              $scope.getContacts();
            }
            return response;
          });
          return $scope.emailPromises.push(updateContactPromise);
        }
      };
      $scope.clearDeleteContactAlerts = function() {
        if ($scope.deleteContactError) {
          delete $scope.deleteContactError;
        }
        if ($scope.deleteContactSuccess) {
          return delete $scope.deleteContactSuccess;
        }
      };
      closeDeleteContactModal = function() {
        delete $scope.contactsToDelete;
        if ($scope.deleteContactModal) {
          $scope.deleteContactModal.close();
        }
        return $rootScope.scrollToTop();
      };
      showDeleteContactError = function() {
        $translate('contacts_warn_delete_failure_body').then(function(translation) {
          return $scope.deleteContactError = translation;
        }, function(translationId) {
          return $scope.deleteContactError = translationId;
        });
        return closeDeleteContactModal();
      };
      openDeleteContactModal = function() {
        $scope.clearDeleteContactAlerts();
        if ($scope.contactsToDelete) {
          return $scope.deleteContactModal = $uibModal.open({
            scope: $scope,
            templateUrl: APP_INFO.rootPath + 'html/modal/deleteContact.html'
          });
        } else {
          return showDeleteContactError();
        }
      };
      $scope.deleteContact = function(contactId) {
        $scope.contactsToDelete = [];
        $scope.contactsToDelete.push(getContactById(contactId));
        return openDeleteContactModal();
      };
      $scope.deleteSelectedContacts = function() {
        $scope.contactsToDelete = angular.copy($rootScope.selectedContacts.contacts);
        return openDeleteContactModal();
      };
      $scope.cancelDeleteContact = function() {
        return closeDeleteContactModal();
      };
      $scope.confirmDeleteContact = function() {
        var contactIds, deleteContactPromise;
        if (!$scope.contactsToDelete) {
          return showDeleteContactError();
        } else {
          contactIds = [];
          angular.forEach($scope.contactsToDelete, function(contact) {
            if (contact.id) {
              return contactIds.push(contact.id);
            }
          });
          deleteContactPromise = ContactService.deleteTeamraiserAddressBookContacts('contact_ids=' + contactIds.toString()).then(function(response) {
            if (response.data.errorResponse) {
              if (response.data.errorResponse.message) {
                $scope.deleteContactError = response.data.errorResponse.message;
              } else {
                $translate('contacts_warn_delete_failure_body').then(function(translation) {
                  return $scope.deleteContactError = translation;
                }, function(translationId) {
                  return $scope.deleteContactError = translationId;
                });
              }
            } else {
              $translate('contacts_delete_success').then(function(translation) {
                return $scope.deleteContactSuccess = translation;
              }, function(translationId) {
                return $scope.deleteContactSuccess = translationId;
              });
            }
            ContactService.resetSelectedContacts();
            closeDeleteContactModal();
            $rootScope.scrollToTop();
            refreshContactsNavBar();
            $scope.getContacts();
            return response;
          });
          return $scope.emailPromises.push(deleteContactPromise);
        }
      };
      $scope.emailSelectedContacts = function() {
        return $location.path('/email/compose');
      };
      if ($scope.filter === 'email_rpt_show_all') {
        emailAllButtonKey = 'contacts_email_all_button';
      } else {
        emailAllButtonKey = 'contacts_email_group_button';
      }
      $translate(emailAllButtonKey).then(function(translation) {
        return $scope.emailAllButtonLabel = translation;
      }, function(translationId) {
        return $scope.emailAllButtonLabel = translationId;
      });
      return $scope.emailAllContacts = function() {
        return $location.path('/email/compose/group/' + $scope.filter);
      };
    }
  ]);

  angular.module('trPcControllers').controller('EmailMessageListViewCtrl', [
    '$scope', '$routeParams', '$location', '$translate', '$timeout', '$uibModal', 'TeamraiserEmailService', 'APP_INFO', function($scope, $routeParams, $location, $translate, $timeout, $uibModal, TeamraiserEmailService, APP_INFO) {
      var closeDeleteMessageModal, closeSentMessageModal, getMessageTypeTranslations;
      $scope.messageType = $routeParams.messageType;
      $scope.refreshContactsNav = 0;
      $scope.emailPromises = [];
      $scope.emailMessages = {
        page: 1
      };
      $scope.getEmailMessages = function() {
        var messageTypes;
        messageTypes = ['draft', 'sentMessage'];
        return angular.forEach(messageTypes, function(messageType) {
          var apiMethod, messageListPromise, pageNumber, pageSize, sortColumn;
          if ($scope.messageType === messageType) {
            apiMethod = 'get' + messageType.charAt(0).toUpperCase() + messageType.slice(1) + 's';
            sortColumn = messageType === 'draft' ? 'modify_date' : 'log.date_sent';
            pageSize = '10';
            pageNumber = $scope.emailMessages.page - 1;
            messageListPromise = TeamraiserEmailService[apiMethod]('list_sort_column=' + sortColumn + '&list_ascending=false&list_page_size=' + pageSize + '&list_page_offset=' + pageNumber).then(function(response) {
              var messageItems;
              messageItems = response.data[apiMethod + 'Response'].messageItem;
              if (!angular.isArray(messageItems)) {
                messageItems = [messageItems];
              }
              $scope.emailMessages.messages = messageItems;
              $scope.emailMessages.totalNumber = response.data[apiMethod + 'Response'].totalNumberResults;
              return response;
            });
            return $scope.emailPromises.push(messageListPromise);
          }
        });
      };
      $scope.getEmailMessages();
      getMessageTypeTranslations = function() {
        if ($scope.getMessageTypeTranslationsTimeout) {
          $timeout.cancel($scope.getMessageTypeTranslationsTimeout);
        }
        return $translate(['drafts_drafts_label', 'sent_sent_message_label']).then(function(translations) {
          var messageTypeNames;
          messageTypeNames = {
            draft: translations.drafts_drafts_label,
            sentMessage: translations.sent_sent_message_label
          };
          return $scope.messageTypeName = messageTypeNames[$scope.messageType];
        }, function(translationIds) {
          return $scope.getMessageTypeTranslationsTimeout = $timeout(getMessageTypeTranslations, 500);
        });
      };
      getMessageTypeTranslations();
      $scope.selectMessage = function(messageId) {
        if ($scope.messageType === 'draft') {
          return $location.path('/email/compose/draft/' + messageId);
        } else {
          TeamraiserEmailService.getSentMessage('message_id=' + messageId).then(function(response) {
            var messageInfo, recipients, ref;
            if (response.data.errorResponse) {

            } else {
              messageInfo = (ref = response.data.getSentMessageResponse) != null ? ref.messageInfo : void 0;
              if (!messageInfo) {

              } else {
                recipients = messageInfo.recipient;
                if (!angular.isArray(recipients)) {
                  recipients = [recipients];
                }
                messageInfo.recipient = recipients;
                return $scope.sentMessage = messageInfo;
              }
            }
          });
          return $scope.viewSentMessageModal = $uibModal.open({
            scope: $scope,
            templateUrl: APP_INFO.rootPath + 'html/modal/viewSentMessage.html',
            size: 'lg'
          });
        }
      };
      closeSentMessageModal = function() {
        return $scope.viewSentMessageModal.close();
      };
      $scope.cancelViewSentMessage = function() {
        return closeSentMessageModal();
      };
      $scope.copySentMessage = function(messageId) {
        closeSentMessageModal();
        return $location.path('/email/compose/copy/' + messageId);
      };
      $scope.deleteMessage = function(messageId) {
        $scope.deleteMessageId = messageId;
        return $scope.deleteMessageModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/deleteEmailMessage.html'
        });
      };
      closeDeleteMessageModal = function() {
        delete $scope.deleteMessageId;
        return $scope.deleteMessageModal.close();
      };
      $scope.cancelDeleteMessage = function() {
        return closeDeleteMessageModal();
      };
      return $scope.confirmDeleteMessage = function() {
        if ($scope.messageType === 'draft') {
          return TeamraiserEmailService.deleteDraft('message_id=' + $scope.deleteMessageId).then(function(response) {
            closeDeleteMessageModal();
            return $scope.getEmailMessages();
          });
        } else {
          return TeamraiserEmailService.deleteSentMessage('message_id=' + $scope.deleteMessageId).then(function(response) {
            closeDeleteMessageModal();
            return $scope.getEmailMessages();
          });
        }
      };
    }
  ]);

  angular.module('trPcControllers').controller('EnterGiftsViewCtrl', [
    '$scope', '$location', '$translate', '$timeout', '$httpParamSerializer', 'TeamraiserEventService', 'TeamraiserGiftService', function($scope, $location, $translate, $timeout, $httpParamSerializer, TeamraiserEventService, TeamraiserGiftService) {
      var ccExpMonthDefault, ccExpMonthOptions, ccExpYearDefault, ccExpYearOptions, getFieldLabelTranslations, getPaymentTypeTranslations, giftCategoryPromise, num, paymentTypeOptions, today;
      $scope.enterGiftsPromises = [];
      paymentTypeOptions = [];
      if ($scope.teamraiserConfig.offlineGiftTypes.cash === 'true') {
        paymentTypeOptions.push({
          value: 'cash',
          name: 'Cash'
        });
      }
      if ($scope.teamraiserConfig.offlineGiftTypes.check === 'true') {
        paymentTypeOptions.push({
          value: 'check',
          name: 'Check'
        });
      }
      if ($scope.teamraiserConfig.offlineGiftTypes.credit === 'true') {
        paymentTypeOptions.push({
          value: 'credit',
          name: 'Credit'
        });
      }
      if ($scope.teamraiserConfig.offlineGiftTypes.later === 'true') {
        paymentTypeOptions.push({
          value: 'later',
          name: 'Pay Later'
        });
      }
      getPaymentTypeTranslations = function() {
        if ($scope.getPaymentTypeTranslationsTimeout) {
          $timeout.cancel($scope.getPaymentTypeTranslationsTimeout);
        }
        return $translate(['gift_payment_type_cash', 'gift_payment_type_check', 'gift_payment_type_credit', 'gift_payment_type_later']).then(function(translations) {
          return angular.forEach(paymentTypeOptions, function(ptOpt) {
            switch (ptOpt.value) {
              case 'cash':
                return ptOpt.name = translations.gift_payment_type_cash;
              case 'check':
                return ptOpt.name = translations.gift_payment_type_check;
              case 'credit':
                return ptOpt.name = translations.gift_payment_type_credit;
              case 'later':
                return ptOpt.name = translations.gift_payment_type_later;
            }
          });
        }, function(translationIds) {
          return $scope.getPaymentTypeTranslationsTimeout = $timeout(getPaymentTypeTranslations, 500);
        });
      };
      getPaymentTypeTranslations();
      today = new Date();
      ccExpMonthOptions = (function() {
        var j, results1;
        results1 = [];
        for (num = j = 1; j <= 12; num = ++j) {
          results1.push({
            name: ('0' + num).slice(-2)
          });
        }
        return results1;
      })();
      ccExpMonthDefault = ('0' + (today.getMonth() + 1).toString()).slice(-2);
      ccExpYearOptions = (function() {
        var j, ref, ref1, results1;
        results1 = [];
        for (num = j = ref = today.getFullYear(), ref1 = today.getFullYear() + 10; ref <= ref1 ? j <= ref1 : j >= ref1; num = ref <= ref1 ? ++j : --j) {
          results1.push({
            name: num.toString()
          });
        }
        return results1;
      })();
      ccExpYearDefault = today.getFullYear().toString();
      $scope.egvm = {
        giftModel: {},
        giftFields: [
          {
            type: 'input',
            key: 'first_name',
            templateOptions: {
              label: 'First Name:',
              required: true
            }
          }, {
            type: 'input',
            key: 'last_name',
            templateOptions: {
              label: 'Last Name:',
              required: true
            }
          }, {
            type: 'input',
            key: 'email',
            templateOptions: {
              label: 'Email:'
            }
          }, {
            type: 'checkbox',
            key: 'showAdditionalFields',
            defaultValue: false,
            templateOptions: {
              label: 'Show donor address fields'
            }
          }, {
            type: 'input',
            key: 'street1',
            hideExpression: "!model.showAdditionalFields",
            templateOptions: {
              label: 'Address:'
            }
          }, {
            type: 'input',
            key: 'street2',
            hideExpression: "!model.showAdditionalFields",
            templateOptions: {
              label: 'Address 2:'
            }
          }, {
            type: 'input',
            key: 'city',
            hideExpression: "!model.showAdditionalFields",
            templateOptions: {
              label: 'City:'
            }
          }, {
            type: 'input',
            key: 'state',
            hideExpression: "!model.showAdditionalFields",
            templateOptions: {
              label: 'State:'
            }
          }, {
            type: 'input',
            key: 'zip',
            hideExpression: "!model.showAdditionalFields",
            templateOptions: {
              label: 'Zip:'
            }
          }, {
            type: 'input',
            key: 'gift_display_name',
            templateOptions: {
              label: 'Recognition Name:'
            }
          }, {
            type: 'checkbox',
            key: 'gift_display_amount',
            defaultValue: true,
            templateOptions: {
              label: 'Yes, display the amount of this gift.'
            }
          }, {
            type: 'checkbox',
            key: 'team_gift',
            defaultValue: false,
            hideExpression: "model.hideTeamGiftOption",
            templateOptions: {
              label: 'Record this gift on behalf of my entire team.'
            }
          }, {
            type: 'input',
            key: 'gift_amount',
            templateOptions: {
              label: 'Amount:',
              required: true
            }
          }, {
            type: 'select',
            key: 'payment_type',
            templateOptions: {
              label: 'Payment Type:',
              options: paymentTypeOptions
            }
          }, {
            type: 'input',
            key: 'check_number',
            hideExpression: "model.payment_type != 'check'",
            templateOptions: {
              label: 'Check Number:'
            }
          }, {
            type: 'input',
            key: 'credit_card_number',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Credit Card Number:'
            }
          }, {
            type: 'select',
            key: 'credit_card_month',
            hideExpression: "model.payment_type != 'credit'",
            defaultValue: ccExpMonthDefault,
            templateOptions: {
              label: 'Credit Card Expiration Month:',
              valueProp: 'name',
              options: ccExpMonthOptions
            }
          }, {
            type: 'select',
            key: 'credit_card_year',
            hideExpression: "model.payment_type != 'credit'",
            defaultValue: ccExpYearDefault,
            templateOptions: {
              label: 'Credit Card Expiration Year:',
              valueProp: 'name',
              options: ccExpYearOptions
            }
          }, {
            type: 'input',
            key: 'credit_card_verification_code',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Verification Code:'
            }
          }, {
            type: 'input',
            key: 'billing_first_name',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing First Name:'
            }
          }, {
            type: 'input',
            key: 'billing_last_name',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing Last Name:'
            }
          }, {
            type: 'input',
            key: 'billing_street1',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing Address:'
            }
          }, {
            type: 'input',
            key: 'billing_street2',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing Address 2:'
            }
          }, {
            type: 'input',
            key: 'billing_city',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing City:'
            }
          }, {
            type: 'input',
            key: 'billing_state',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing State:'
            }
          }, {
            type: 'input',
            key: 'billing_zip',
            hideExpression: "model.payment_type != 'credit'",
            templateOptions: {
              label: 'Billing Zip:'
            }
          }, {
            type: 'select',
            key: 'gift_category_id',
            hideExpression: "model.hideGiftCategoriesOption",
            templateOptions: {
              label: 'Gift Category:',
              options: []
            }
          }
        ]
      };
      getFieldLabelTranslations = function() {
        if ($scope.getFieldLabelTranslationsTimeout) {
          $timeout.cancel($scope.getFieldLabelTranslationsTimeout);
        }
        return $translate(['gift_first_name_label', 'gift_last_name_label', 'gift_email_label', 'gift_addl_options_label', 'gift_street1_label', 'gift_street2_label', 'gift_city_label', 'gift_state_label', 'gift_zip_label', 'gift_recongition_name_label', 'gift_display_personal_page_label', 'gift_record_team_gift', 'gift_amount_label', 'gift_payment_type_label', 'gift_check_number_label', 'gift_credit_card_number_label', 'gift_credit_expiration_date_label', 'gift_credit_verification_code_label', 'gift_billing_first_name_label', 'gift_billing_last_name_label', 'gift_billing_street1_label', 'gift_billing_street2_label', 'gift_billing_city_label', 'gift_billing_state_label', 'gift_billing_zip_label', 'gift_gift_category_label']).then(function(translations) {
          return angular.forEach($scope.egvm.giftFields, function(giftField) {
            switch (giftField.key) {
              case 'first_name':
                giftField.templateOptions.label = translations.gift_first_name_label;
                break;
              case 'last_name':
                giftField.templateOptions.label = translations.gift_last_name_label;
                break;
              case 'email':
                giftField.templateOptions.label = translations.gift_email_label;
                break;
              case 'showAdditionalFields':
                giftField.templateOptions.label = translations.gift_addl_options_label;
                break;
              case 'street1':
                giftField.templateOptions.label = translations.gift_street1_label;
                break;
              case 'street2':
                giftField.templateOptions.label = translations.gift_street2_label;
                break;
              case 'city':
                giftField.templateOptions.label = translations.gift_city_label;
                break;
              case 'state':
                giftField.templateOptions.label = translations.gift_state_label;
                break;
              case 'zip':
                giftField.templateOptions.label = translations.gift_zip_label;
                break;
              case 'gift_display_name':
                giftField.templateOptions.label = translations.gift_recongition_name_label;
                break;
              case 'gift_display_amount':
                giftField.templateOptions.label = translations.gift_display_personal_page_label;
                break;
              case 'team_gift':
                giftField.templateOptions.label = translations.gift_record_team_gift;
                break;
              case 'gift_amount':
                giftField.templateOptions.label = translations.gift_amount_label;
                break;
              case 'payment_type':
                giftField.templateOptions.label = translations.gift_payment_type_label;
                break;
              case 'check_number':
                giftField.templateOptions.label = translations.gift_check_number_label;
                break;
              case 'credit_card_number':
                giftField.templateOptions.label = translations.gift_credit_card_number_label;
                break;
              case 'credit_card_month':
                giftField.templateOptions.label = translations.gift_credit_expiration_date_label;
                break;
              case 'credit_card_year':
                giftField.templateOptions.label = translations.gift_credit_expiration_date_label;
                break;
              case 'credit_card_verification_code':
                giftField.templateOptions.label = translations.gift_credit_verification_code_label;
                break;
              case 'billing_first_name':
                giftField.templateOptions.label = translations.gift_billing_first_name_label;
                break;
              case 'billing_last_name':
                giftField.templateOptions.label = translations.gift_billing_last_name_label;
                break;
              case 'billing_street1':
                giftField.templateOptions.label = translations.gift_billing_street1_label;
                break;
              case 'billing_street2':
                giftField.templateOptions.label = translations.gift_billing_street2_label;
                break;
              case 'billing_city':
                giftField.templateOptions.label = translations.gift_billing_city_label;
                break;
              case 'billing_state':
                giftField.templateOptions.label = translations.gift_billing_state_label;
                break;
              case 'billing_zip':
                giftField.templateOptions.label = translations.gift_billing_zip_label;
                break;
              case 'gift_category_id':
                giftField.templateOptions.label = translations.gift_gift_category_label;
            }
            return giftField.templateOptions.label = giftField.templateOptions.label.replace(/\*/gm, '');
          });
        }, function(translationIds) {
          return $scope.getFieldLabelTranslationsTimeout = $timeout(getFieldLabelTranslations, 500);
        });
      };
      getFieldLabelTranslations();
      if ($scope.teamraiserConfig.showGiftCategories === 'true') {
        $scope.egvm.giftModel.hideGiftCategoriesOption = true;
        giftCategoryPromise = TeamraiserGiftService.getGiftCategories().then(function(response) {
          var giftCategories, giftCategoryOptions;
          giftCategories = response.data.getGiftCategoriesResponse.giftCategory;
          if (!angular.isArray(giftCategories)) {
            giftCategories = [giftCategories];
          }
          giftCategoryOptions = [];
          angular.forEach(giftCategories, function(giftCategory) {
            if (angular.isString(giftCategory.name)) {
              return giftCategoryOptions.push({
                value: giftCategory.id,
                name: giftCategory.name
              });
            }
          });
          angular.forEach($scope.egvm.giftFields, function(giftField) {
            if (giftField.key === 'gift_category_id') {
              return giftField.templateOptions.options = angular.copy(giftCategoryOptions);
            }
          });
          $scope.egvm.giftModel.hideGiftCategoriesOption = false;
          return response;
        });
        $scope.enterGiftsPromises.push(giftCategoryPromise);
      } else {
        $scope.egvm.giftModel.hideGiftCategoriesOption = true;
      }
      $scope.egvm.originalFields = angular.copy($scope.egvm.giftFields);
      $scope.egvm.giftModel.hideTeamGiftOption = !($scope.teamraiserConfig.offlineTeamGifts === 'MEMBERS' || ($scope.teamraiserConfig.offlineTeamGifts === 'CAPTAINS' && $scope.participantRegistration.aTeamCaptain === 'true'));
      $scope.clearGiftAlerts = function() {
        var autoclose, ref;
        autoclose = ((ref = $scope.egvm.giftAlerts) != null ? ref.addGiftSuccess : void 0) && $scope.egvm.giftAlerts.addGiftSuccess;
        $scope.egvm.giftAlerts = {
          addGiftAttempt: false,
          addGiftSuccess: false,
          addGiftAgainAttempt: false,
          addGiftAgainSuccess: false,
          addGiftFailure: false,
          addGiftFailureMessage: ''
        };
        if (autoclose) {
          return $scope.cancelGiftEntry();
        }
      };
      $scope.clearGiftAlerts();
      $scope.cancelGiftEntry = function() {
        return $location.path('/dashboard');
      };
      $scope.addGift = function() {
        var addGiftPromise;
        if (!$scope.egvm.giftAlerts.addGiftAttempt) {
          $scope.egvm.giftAlerts.addGiftAttempt = true;
          addGiftPromise = TeamraiserGiftService.addGift($httpParamSerializer($scope.egvm.giftModel)).then(function(response) {
            $scope.egvm.giftAlerts.addGiftAttempt = false;
            if (response.data.errorResponse) {
              $scope.egvm.giftAlerts.addGiftFailure = true;
              if (response.data.errorResponse.message) {
                $scope.egvm.giftAlerts.addGiftFailureMessage = response.data.errorResponse.message;
              } else {
                $translate('gift_submission_error').then(function(translation) {
                  return $scope.egvm.giftAlerts.addGiftFailureMessage = translation;
                }, function(translationId) {
                  return $scope.egvm.giftAlerts.addGiftFailureMessage = translationId;
                });
              }
            } else {
              if ($scope.egvm.giftAlerts.addGiftAgainAttempt) {
                $scope.egvm.giftAlerts.addGiftAgainSuccess = true;
              } else {
                $scope.egvm.giftAlerts.addGiftSuccess = true;
              }
              $scope.egvm.giftOptions.resetModel();
            }
            window.scrollTo(0, 0);
            return response;
          });
          return $scope.enterGiftsPromises.push(addGiftPromise);
        }
      };
      return $scope.addGiftClearForm = function() {
        $scope.egvm.giftAlerts.addGiftAgainAttempt = true;
        return $scope.addGift();
      };
    }
  ]);

  angular.module('trPcControllers').controller('EventOptionsViewCtrl', [
    '$scope', '$translate', '$uibModal', 'TeamraiserRegistrationService', 'TeamraiserTeamService', 'TeamraiserCompanyService', 'APP_INFO', function($scope, $translate, $uibModal, TeamraiserRegistrationService, TeamraiserTeamService, TeamraiserCompanyService, APP_INFO) {
      var ref, setDisplayNameSetting, setPersonalPrivacySetting;
      $scope.eventOptionsPromises = [];
      $scope.refreshRegistration = function() {
        var refreshRegistrationPromise;
        refreshRegistrationPromise = TeamraiserRegistrationService.getRegistration().then(function(response) {
          setPersonalPrivacySetting();
          return setDisplayNameSetting();
        });
        return $scope.eventOptionsPromises.push(refreshRegistrationPromise);
      };
      $scope.refreshRegistration();
      $scope.personalPrivacySettings = {
        isPrivate: $scope.participantRegistration.privatePage === 'true',
        privacySetting: '',
        updatePrivacySuccess: false,
        updatePrivacyFailure: false,
        updatePrivacyFailureMessage: ''
      };
      setPersonalPrivacySetting = function() {
        if ($scope.participantRegistration.privatePage === 'true') {
          return $scope.personalPrivacySettings.privacySetting = 'private';
        } else {
          return $scope.personalPrivacySettings.privacySetting = 'public';
        }
      };
      $scope.updatePrivacyOptions = function() {
        var dataStr, updatePrivacyPromise;
        $scope.resetPrivacyAlerts();
        dataStr = 'is_private=';
        if ($scope.personalPrivacySettings.privacySetting === 'private') {
          dataStr += 'true';
        } else {
          dataStr += 'false';
        }
        updatePrivacyPromise = TeamraiserRegistrationService.updatePersonalPagePrivacy(dataStr).then(function(response) {
          var ref, ref1;
          if ((ref = response.data.updatePersonalPagePrivacyResponse) != null ? ref.privatePage : void 0) {
            $scope.personalPrivacySettings.isPrivate = response.data.updatePersonalPagePrivacyResponse.privatePage === 'true';
            $scope.personalPrivacySettings.updatePrivacySuccess = true;
            $scope.refreshRegistration();
          } else {
            $scope.personalPrivacySettings.updatePrivacyFailure = true;
            $scope.personalPrivacySettings.updatePrivacyFailureMessage = (ref1 = response.data.errorResponse) != null ? ref1.message : void 0;
          }
          return response;
        });
        return $scope.eventOptionsPromises.push(updatePrivacyPromise);
      };
      $scope.resetPrivacyAlerts = function() {
        $scope.personalPrivacySettings.updatePrivacySuccess = false;
        $scope.personalPrivacySettings.updatePrivacyFailure = false;
        return $scope.personalPrivacySettings.updatePrivacyFailureMessage = '';
      };
      $scope.displayNameSettings = {
        showDisplayNamePanel: false,
        standardRegAllowed: $scope.teamraiserConfig.standardRegistrationAllowed === 'true' || $scope.teamraiserConfig.standardRegistrationAllowed === true,
        anonymousRegAllowed: $scope.teamraiserConfig.anonymousRegistrationAllowed === 'true' || $scope.teamraiserConfig.anonymousRegistrationAllowed === true,
        screennameRegAllowed: $scope.teamraiserConfig.screennameRegistrationAllowed === 'true' || $scope.teamraiserConfig.screennameRegistrationAllowed === true,
        updateScreennameSuccess: false,
        updateScreennameFailure: false,
        updateScreennameFailureMessage: '',
        currentSelection: null,
        currentScreenname: null
      };
      if (($scope.displayNameSettings.standardRegAllowed && ($scope.displayNameSettings.anonymousRegAllowed || $scope.displayNameSettings.screennameRegAllowed)) || ($scope.displayNameSettings.anonymousRegAllowed && $scope.displayNameSettings.screennameRegAllowed)) {
        $scope.displayNameSettings.showDisplayNamePanel = true;
      }
      setDisplayNameSetting = function() {
        if ($scope.participantRegistration.anonymous === 'true' || $scope.participantRegistration.anonymous === true) {
          $scope.displayNameSettings.currentSelection = 'anonymous';
          return $scope.displayNameSettings.currentScreenname = null;
        } else if ($scope.participantRegistration.screenname) {
          $scope.displayNameSettings.currentSelection = 'screenname';
          return $scope.displayNameSettings.currentScreenname = $scope.participantRegistration.screenname;
        } else {
          $scope.displayNameSettings.currentSelection = 'standard';
          return $scope.displayNameSettings.currentScreenname = null;
        }
      };
      $scope.updateDisplayNameSetting = function() {
        var dataStr, updateDisplayNamePromise;
        $scope.resetScreennameAlerts();
        dataStr = '';
        switch ($scope.displayNameSettings.currentSelection) {
          case 'anonymous':
            dataStr = 'anonymous_registration=true';
            break;
          case 'screenname':
            dataStr = 'screenname=' + encodeURIComponent($scope.displayNameSettings.currentScreenname);
            break;
          case 'standard':
            dataStr = 'standard_registration=true';
            break;
          default:
            dataStr = 'standard_registration=true';
        }
        updateDisplayNamePromise = TeamraiserRegistrationService.updateRegistration(dataStr).then(function(response) {
          if (response.data.errorResponse) {
            $scope.displayNameSettings.updateScreennameFailure = true;
            $scope.displayNameSettings.updateScreennameFailureMessage = response.data.errorResponse.message;
          } else {
            $scope.displayNameSettings.updateScreennameSuccess = true;
            $scope.refreshRegistration();
          }
          return response;
        });
        return $scope.eventOptionsPromises.push(updateDisplayNamePromise);
      };
      $scope.resetScreennameAlerts = function() {
        $scope.displayNameSettings.updateScreennameSuccess = false;
        $scope.displayNameSettings.updateScreennameFailure = false;
        return $scope.displayNameSettings.updateScreennameFailureMessage = '';
      };
      $scope.manageCompanyMembership = {
        showManageCompanyPanel: false,
        newCompanyEntryAllowed: false,
        companyOptions: [],
        currentCompanyName: '',
        currentSelection: (ref = $scope.participantRegistration.companyInformation) != null ? ref.companyId : void 0,
        newCompanyEntry: '',
        updateCompanySuccess: false,
        updateCompanyFailure: false,
        updateCompanyFailureMessage: ''
      };
      $scope.getCompanyList = function() {
        var getCompanyListPromise;
        getCompanyListPromise = TeamraiserCompanyService.getCompanyList().then(function(response) {
          var ref1, results;
          if (response.data.errorResponse) {
            $scope.manageCompanyMembership.showManageCompanyPanel = false;
          } else {
            results = response.data.getCompanyListResponse.companyItem;
            if (!angular.isArray(results)) {
              results = [results];
            }
            $scope.manageCompanyMembership.companyOptions = results;
            if ((ref1 = $scope.participantRegistration.companyInformation) != null ? ref1.companyId : void 0) {
              angular.forEach(results, function(result) {
                if ($scope.participantRegistration.companyInformation.companyId === result.companyId) {
                  return $scope.manageCompanyMembership.currentCompanyName = result.companyName;
                }
              });
            } else {
              $translate('dashboard_company_null_label').then(function(translation) {
                return $scope.manageCompanyMembership.currentCompanyName = translation;
              }, function(translationId) {
                return $scope.manageCompanyMembership.currentCompanyName = translationId;
              });
            }
          }
          return response;
        });
        return $scope.eventOptionsPromises.push(getCompanyListPromise);
      };
      $scope.openCompanySelection = function() {
        $scope.manageCompanyMembership.newCompanyEntry = '';
        return $scope.companySelectionModal = $uibModal.open({
          scope: $scope,
          templateUrl: APP_INFO.rootPath + 'html/modal/editCompanyAssociation.html'
        });
      };
      $scope.resetCompanyAlerts = function(closeModal) {
        $scope.manageCompanyMembership.updateCompanySuccess = false;
        $scope.manageCompanyMembership.updateCompanyFailure = false;
        $scope.manageCompanyMembership.updateCompanyFailureMessage = '';
        if (closeModal) {
          return $scope.companySelectionModal.close();
        }
      };
      $scope.initCompanyInfo = function() {
        if ($scope.participantRegistration.teamId === '-1' && $scope.teamraiserConfig.participantCompanyAssociationAllowed === "true") {
          $scope.manageCompanyMembership.showManageCompanyPanel = true;
          if ($scope.teamraiserConfig.participantCompanyNewEntryAllowed === "true") {
            $scope.manageCompanyMembership.newCompanyEntryAllowed = true;
          }
        } else if ($scope.participantRegistration.teamId !== '-1' && $scope.participantRegistration.aTeamCaptain === "true" && $scope.teamraiserConfig.companyAssociationAllowed === "true") {
          $scope.manageCompanyMembership.showManageCompanyPanel = true;
          if ($scope.teamraiserConfig.companyNewEntryAllowed === "true") {
            $scope.manageCompanyMembership.newCompanyEntryAllowed = true;
          }
        } else {
          $scope.manageCompanyMembership.showManageCompanyPanel = false;
          $scope.manageCompanyMembership.newCompanyEntryAllowed = false;
        }
        if ($scope.manageCompanyMembership.showManageCompanyPanel) {
          $scope.getCompanyList();
        }
        return $scope.resetCompanyAlerts(false);
      };
      $scope.initCompanyInfo();
      $scope.updateCompanyAssociation = function() {
        var dataStr, updateParticipantCompanyPromise;
        if ($scope.manageCompanyMembership.newCompanyEntry.length > 0) {
          dataStr = 'company_name=' + encodeURIComponent($scope.manageCompanyMembership.newCompanyEntry);
        } else {
          dataStr = 'company_id=' + $scope.manageCompanyMembership.currentSelection;
        }
        if ($scope.participantRegistration.teamId === '-1') {
          updateParticipantCompanyPromise = TeamraiserRegistrationService.updateRegistration(dataStr).then(function(response) {
            return $scope.updateCompanyAssociationResponse(response);
          });
        } else {
          updateParticipantCompanyPromise = TeamraiserTeamService.updateTeamInformation(dataStr).then(function(response) {
            return $scope.updateCompanyAssociationResponse(response);
          });
        }
        return $scope.eventOptionsPromises.push(updateParticipantCompanyPromise);
      };
      $scope.updateCompanyAssociationResponse = function(response) {
        var ref1, ref2, ref3, ref4;
        if (response.data.errorResponse) {
          $scope.manageCompanyMembership.updateCompanyFailure = true;
          if (response.data.errorResponse.message) {
            $scope.manageCompanyMembership.updateCompanyFailureMessage = response.data.errorResponse.message;
          } else {
            $translate('company_selection_update_unexpected_error').then(function(translation) {
              return $scope.manageCompanyMembership.updateCompanyFailureMessage = translation;
            }, function(translationId) {
              return $scope.manageCompanyMembership.updateCompanyFailureMessage = translationId;
            });
          }
        } else {
          $scope.manageCompanyMembership.updateCompanySuccess = true;
          if ($scope.participantRegistration.companyInformation) {
            $scope.participantRegistration.companyInformation.companyId = ((ref1 = response.data.updateTeamInformationResponse) != null ? ref1.companyId : void 0) || ((ref2 = response.data.updateRegistrationResponse) != null ? ref2.companyId : void 0);
          } else {
            $scope.participantRegistration.companyInformation = {
              companyId: ((ref3 = response.data.updateTeamInformationResponse) != null ? ref3.companyId : void 0) || ((ref4 = response.data.updateRegistrationResponse) != null ? ref4.companyId : void 0)
            };
          }
          $scope.getCompanyList();
        }
        return response;
      };
      $scope.manageTeamMembership = {
        showManageTeamMembership: $scope.participantRegistration.teamId === '-1' || $scope.participantRegistration.aTeamCaptain !== 'true',
        currentTeamId: $scope.participantRegistration.teamId,
        manageTeamMembershipAlerts: [],
        currentSelection: 'stay',
        joinTeamAlerts: [],
        joinTeamSearch: {
          teamName: '',
          teamCompany: '',
          captainFirst: '',
          captainLast: '',
          searchPage: 1,
          searchString: '',
          searchSubmitted: false,
          searchResults: [],
          searchTotalNumber: 0,
          joinTeamId: '',
          joinTeamPassword: ''
        }
      };
      $scope.searchTeams = function() {
        var captainNameLength, dataStr;
        $scope.clearAllTeamMembershipAlerts();
        if ($scope.manageTeamMembership.joinTeamSearch.searchSubmitted) {
          $scope.manageTeamMembership.joinTeamSearch.searchPage = 1;
          $scope.manageTeamMembership.joinTeamSearch.searchString = '';
          $scope.manageTeamMembership.joinTeamSearch.searchSubmitted = false;
          $scope.manageTeamMembership.joinTeamSearch.searchResults = [];
          $scope.manageTeamMembership.joinTeamSearch.searchTotalNumber = 0;
        }
        dataStr = '';
        if ($scope.manageTeamMembership.joinTeamSearch.teamName.length > 0) {
          dataStr += '&team_name=' + $scope.manageTeamMembership.joinTeamSearch.teamName;
        }
        if ($scope.manageTeamMembership.joinTeamSearch.teamCompany.length > 0) {
          dataStr += '&team_company=' + $scope.manageTeamMembership.joinTeamSearch.teamCompany;
        }
        if ($scope.manageTeamMembership.joinTeamSearch.captainFirst.length > 0 || $scope.manageTeamMembership.joinTeamSearch.captainLast.length > 0) {
          captainNameLength = $scope.manageTeamMembership.joinTeamSearch.captainFirst.length + $scope.manageTeamMembership.joinTeamSearch.captainLast.length;
          if (dataStr.length === 0 && captainNameLength < 3) {
            $translate('manage_membership_search_captain_name_min_chars').then(function(translation) {
              return $scope.manageTeamMembership.joinTeamAlerts.push({
                type: 'danger',
                msg: translation
              });
            }, function(translationId) {
              return $scope.manageTeamMembership.joinTeamAlerts.push({
                type: 'danger',
                msg: translationId
              });
            });
          } else {
            if ($scope.manageTeamMembership.joinTeamSearch.captainFirst.length > 0) {
              dataStr += '&first_name=' + $scope.manageTeamMembership.joinTeamSearch.captainFirst;
            }
            if ($scope.manageTeamMembership.joinTeamSearch.captainLast.length > 0) {
              dataStr += '&last_name=' + $scope.manageTeamMembership.joinTeamSearch.captainLast;
            }
          }
        }
        if (dataStr.length === 0) {
          return $translate('manage_membership_search_failure').then(function(translation) {
            return $scope.manageTeamMembership.joinTeamAlerts.push({
              type: 'danger',
              msg: translation
            });
          }, function(translationId) {
            return $scope.manageTeamMembership.joinTeamAlerts.push({
              type: 'danger',
              msg: translationId
            });
          });
        } else {
          $scope.manageTeamMembership.joinTeamSearch.searchString = dataStr;
          return $scope.searchTeamsPage();
        }
      };
      $scope.searchTeamsPage = function() {
        var dataStr, searchTeamsPromise;
        dataStr = 'include_cross_event=false&full_search=false';
        dataStr += '&list_sort_column=name&list_ascending=true';
        dataStr += '&list_page_size=5&list_page_offset=' + ($scope.manageTeamMembership.joinTeamSearch.searchPage - 1);
        dataStr += $scope.manageTeamMembership.joinTeamSearch.searchString;
        $scope.manageTeamMembership.joinTeamSearch.searchSubmitted = true;
        searchTeamsPromise = TeamraiserTeamService.getTeams(dataStr).then(function(response) {
          var results;
          if (response.data.errorResponse) {
            if (response.data.errorResponse.message) {
              $scope.manageTeamMembership.joinTeamAlerts.push({
                type: 'danger',
                msg: response.data.errorResponse.message
              });
            } else {
              $translate('manage_membership_search_failure').then(function(translation) {
                return $scope.manageTeamMembership.joinTeamAlerts.push({
                  type: 'danger',
                  msg: translation
                });
              }, function(translationId) {
                return $scope.manageTeamMembership.joinTeamAlerts.push({
                  type: 'danger',
                  msg: translationId
                });
              });
            }
          } else {
            results = response.data.getTeamSearchByInfoResponse.team;
            if (!angular.isArray(results)) {
              results = [results];
            }
            $scope.manageTeamMembership.joinTeamSearch.searchResults = results;
            $scope.manageTeamMembership.joinTeamSearch.searchTotalNumber = Number(response.data.getTeamSearchByInfoResponse.totalNumberResults);
          }
          return response;
        });
        return $scope.eventOptionsPromises.push(searchTeamsPromise);
      };
      $scope.joinTeam = function(teamId, requiresPassword, teamPassword) {
        var dataStr, joinTeamPromise;
        if (requiresPassword && requiresPassword === 'true' && (!teamPassword || teamPassword.length === 0)) {
          $scope.manageTeamMembership.joinTeamSearch.joinTeamId = teamId;
          $scope.manageTeamMembership.joinTeamSearch.joinTeamPassword = '';
          return $scope.joinTeamPasswordModal = $uibModal.open({
            scope: $scope,
            templateUrl: APP_INFO.rootPath + 'html/modal/joinTeamPassword.html'
          });
        } else {
          dataStr = 'team_id=' + teamId;
          if (requiresPassword && requiresPassword === 'true' && teamPassword && teamPassword.length > 0) {
            dataStr += '&team_password=' + teamPassword;
          }
          joinTeamPromise = TeamraiserTeamService.joinTeam(dataStr).then(function(response) {
            var ref1, ref2, ref3, ref4, teamName;
            if (response.data.errorResponse) {
              if (response.data.errorResponse.message) {
                $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                  type: 'danger',
                  msg: response.data.errorResponse.message
                });
              } else {
                $translate('manage_membership_join_team_unexpected_error').then(function(translation) {
                  return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                    type: 'danger',
                    msg: translation
                  });
                }, function(translationId) {
                  return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                    type: 'danger',
                    msg: translationId
                  });
                });
              }
            } else {
              teamName = (ref1 = response.data.joinTeamResponse) != null ? (ref2 = ref1.team) != null ? ref2.name : void 0 : void 0;
              $translate('manage_membership_join_team_success').then(function(translation) {
                return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                  type: 'success',
                  msg: translation + teamName + '.'
                });
              }, function(translationId) {
                return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                  type: 'success',
                  msg: translationId + teamName + '.'
                });
              });
              $scope.manageTeamMembership.joinTeamSearch.joinTeamId = '';
              $scope.manageTeamMembership.joinTeamSearch.joinTeamPassword = '';
              $scope.manageTeamMembership.currentTeamId = (ref3 = response.data.joinTeamResponse) != null ? (ref4 = ref3.team) != null ? ref4.id : void 0 : void 0;
              $scope.manageTeamMembership.currentSelection = 'stay';
              $scope.refreshRegistration();
            }
            return response;
          });
          return $scope.eventOptionsPromises.push(joinTeamPromise);
        }
      };
      $scope.leaveTeam = function() {
        var leaveTeamPromise;
        leaveTeamPromise = TeamraiserTeamService.leaveTeam().then(function(response) {
          if (response.data.errorResponse) {
            if (response.data.errorResponse.message) {
              $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                type: 'danger',
                msg: response.data.errorResponse.message
              });
            } else {
              $translate('manage_membership_leave_team_unexpected_error').then(function(translation) {
                return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                  type: 'danger',
                  msg: translation
                });
              }, function(translationId) {
                return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                  type: 'danger',
                  msg: translationId
                });
              });
            }
          } else {
            $translate('manage_membership_leave_team_success').then(function(translation) {
              return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                type: 'success',
                msg: translation
              });
            }, function(translationId) {
              return $scope.manageTeamMembership.manageTeamMembershipAlerts.push({
                type: 'success',
                msg: translationId
              });
            });
            $scope.manageTeamMembership.currentTeamId = '-1';
            $scope.manageTeamMembership.currentSelection = 'stay';
            $scope.refreshRegistration();
          }
          return response;
        });
        return $scope.eventOptionsPromises.push(joinTeamPromise);
      };
      $scope.cancelJoinTeamPassword = function() {
        $scope.manageTeamMembership.joinTeamSearch.joinTeamId = '';
        $scope.manageTeamMembership.joinTeamSearch.joinTeamPassword = '';
        return $scope.joinTeamPasswordModal.close();
      };
      $scope.clearTeamMembershipAlert = function(index) {
        return $scope.manageTeamMembership.manageTeamMembershipAlerts.splice(index, 1);
      };
      $scope.clearJoinTeamAlert = function(index) {
        return $scope.manageTeamMembership.joinTeamAlerts.splice(index, 1);
      };
      return $scope.clearAllTeamMembershipAlerts = function() {
        $scope.manageTeamMembership.manageTeamMembershipAlerts = [];
        return $scope.manageTeamMembership.joinTeamAlerts = [];
      };
    }
  ]);

  angular.module('trPcControllers').controller('LoginCtrl', [
    '$rootScope', '$scope', '$route', '$httpParamSerializer', '$translate', '$window', 'AuthService', function($rootScope, $scope, $route, $httpParamSerializer, $translate, $window, AuthService) {
      var setUserNameOrPasswordError;
      $scope.resetLoginAlerts = function() {
        if ($scope.loginError) {
          return delete $scope.loginError;
        }
      };
      setUserNameOrPasswordError = function() {
        return $translate('error_invalid_username_or_password').then(function(translation) {
          return $scope.loginError = translation;
        }, function(translationId) {
          return $scope.loginError = translationId;
        });
      };
      $scope.consLogin = {
        user_name: '',
        password: ''
      };
      return $scope.submitLogin = function() {
        if ($scope.consLogin.user_name === '' || $scope.consLogin.password === '') {
          return setUserNameOrPasswordError();
        } else {
          $scope.resetLoginAlerts();
          return AuthService.login($httpParamSerializer($scope.consLogin)).then(function(response) {
            var consId, errorResponse, ref;
            errorResponse = response.data.errorResponse;
            if (errorResponse) {
              if (['200', '201', '202', '204'].indexOf(errorResponse.code)) {
                return setUserNameOrPasswordError();
              } else {
                return $scope.loginError = errorResponse.message;
              }
            } else {
              consId = response.data.loginResponse.cons_id;
              if (Number(consId) !== Number($rootScope.consId)) {
                return $window.location.reload();
              } else {
                if ($rootScope.loginModal) {
                  $rootScope.loginModal.close();
                  delete $rootScope.loginModal;
                }
                angular.element(document).find('.modal').click();
                $rootScope.consId = ((ref = response.data.loginResponse) != null ? ref.cons_id : void 0) || -1;
                delete $rootScope.authToken;
                return $route.reload();
              }
            }
          });
        }
      };
    }
  ]);

  angular.module('trPcControllers').controller('NgPcMainCtrl', [
    '$rootScope', '$location', 'LocaleService', function($rootScope, $location, LocaleService) {
      $rootScope.$location = $location;
      $rootScope.baseUrl = $location.absUrl().split('#')[0];
      LocaleService.setLocale($rootScope.locale);
      return $rootScope.changeLocale = function() {
        return LocaleService.setLocale();
      };
    }
  ]);

  angular.module('trPcControllers').controller('SurveyQuestionsViewCtrl', [
    '$scope', '$translate', '$httpParamSerializer', 'TeamraiserSurveyResponseService', function($scope, $translate, $httpParamSerializer, TeamraiserSurveyResponseService) {
      $scope.surveyResponsePromises = [];
      $scope.sqvm = {
        surveyFields: [],
        surveyModel: {},
        updateSurveyResponses: $scope.updateSurveyResponses
      };
      $scope.getSurveyResponses = function() {
        var getSurveyResponsesPromise;
        getSurveyResponsesPromise = TeamraiserSurveyResponseService.getSurveyResponses().then(function(response) {
          var surveyResponses;
          surveyResponses = response.data.getSurveyResponsesResponse.responses;
          if (!angular.isArray(surveyResponses)) {
            surveyResponses = [surveyResponses];
          }
          angular.forEach(surveyResponses, function(surveyResponse) {
            var fieldValue, thisField;
            if (surveyResponse) {
              thisField = {
                type: null,
                key: 'question_' + surveyResponse.questionId,
                data: {
                  dataType: surveyResponse.questionType
                },
                templateOptions: {
                  label: surveyResponse.questionText,
                  required: surveyResponse.questionRequired === 'true'
                }
              };
              switch (surveyResponse.questionType) {
                case 'Caption':
                  thisField.type = 'caption';
                  break;
                case 'DateQuestion':
                  thisField.type = 'datepicker';
                  break;
                case 'NumericValue':
                  thisField.type = 'input';
                  break;
                case 'ShortTextValue':
                  thisField.type = 'input';
                  thisField.templateOptions.maxChars = 40;
                  break;
                case 'TextValue':
                  thisField.type = 'input';
                  thisField.templateOptions.maxChars = 255;
                  break;
                case 'LargeTextValue':
                  thisField.type = 'textarea';
                  break;
                case 'TrueFalse':
                  thisField.type = 'select';
                  break;
                case 'YesNo':
                  thisField.type = 'select';
                  break;
                case 'MultiSingle':
                  thisField.type = 'select';
                  break;
                case 'ComboChoice':
                  thisField.type = 'typeahead';
                  break;
                case 'Categories':
                  thisField.type = 'checkbox';
                  break;
                case 'MultiMulti':
                  thisField.type = 'checkbox';
                  break;
                case 'MultiSingleRadio':
                  thisField.type = 'radio';
                  break;
                case 'RatingScale':
                  thisField.type = 'radio';
                  break;
                case 'Captcha':
                  thisField.type = 'captcha';
                  break;
                case 'HiddenInterests':
                  thisField.type = 'hidden';
                  break;
                case 'HiddenTextValue':
                  thisField.type = 'hidden';
                  break;
                case 'HiddenTrueFalse':
                  thisField.type = 'hidden';
                  break;
                default:
                  thisField.type = 'input';
              }
              if (surveyResponse.isHidden === 'true') {
                thisField.type = 'hidden';
              }
              if (surveyResponse.questionAnswer) {
                thisField.templateOptions.options = [];
                angular.forEach(surveyResponse.questionAnswer, function(choice) {
                  return thisField.templateOptions.options.push({
                    name: choice.label,
                    value: choice.value
                  });
                });
              }
              $scope.sqvm.surveyFields.push(thisField);
              if (surveyResponse.responseValue === 'User Provided No Response') {
                return $scope.sqvm.surveyModel[thisField.key] = null;
              } else if (thisField.type === 'datepicker') {
                fieldValue = surveyResponse.responseValue.split("-");
                return $scope.sqvm.surveyModel[thisField.key] = new Date(parseInt(fieldValue[0]), parseInt(fieldValue[1]) - 1, parseInt(fieldValue[2]), parseInt(fieldValue[3].split(":")[0]), parseInt(fieldValue[3].split(":")[1]));
              } else if (thisField.type === 'checkbox') {
                return $scope.sqvm.surveyModel[thisField.key] = surveyResponse.responseValue === 'true';
              } else {
                return $scope.sqvm.surveyModel[thisField.key] = surveyResponse.responseValue;
              }
            }
          });
          $scope.sqvm.originalFields = angular.copy($scope.sqvm.surveyFields);
          return response;
        });
        return $scope.surveyResponsePromises.push(getSurveyResponsesPromise);
      };
      $scope.getSurveyResponses();
      $scope.updateSurveyResponses = function($event) {
        var updateSurveyResponsesPromise;
        $event.preventDefault();
        updateSurveyResponsesPromise = TeamraiserSurveyResponseService.updateSurveyResponses($httpParamSerializer($scope.sqvm.surveyModel)).then(function(response) {
          if (response.data.errorResponse) {
            $scope.updateSurveySuccess = false;
            $scope.updateSurveyFailure = true;
            if (response.data.errorResponse.message) {
              $scope.updateSurveyFailureMessage = response.data.errorResponse.message;
            } else {
              $translate('survey_save_failure').then(function(translation) {
                return $scope.updateSurveyFailureMessage = translation;
              }, function(translationId) {
                return $scope.updateSurveyFailureMessage = translationId;
              });
            }
          } else {
            $scope.updateSurveySuccess = true;
            $scope.updateSurveyFailure = false;
            $scope.sqvm.surveyOptions.updateInitialValue();
          }
          return response;
        });
        return $scope.surveyResponsePromises.push(updateSurveyResponsesPromise);
      };
      $scope.resetSurveyAlerts = function() {
        $scope.updateSurveySuccess = false;
        $scope.updateSurveyFailure = false;
        return $scope.updateSurveyFailureMessage = '';
      };
      return $scope.resetSurveyAlerts();
    }
  ]);

  angular.module('trPcApp').directive('badgeList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/badgeList.html',
        restrict: 'E',
        replace: true,
        scope: {
          badges: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('companyTeamList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/companyTeamList.html',
        restrict: 'E',
        replace: true,
        scope: {
          teams: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('contactList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/contactList.html',
        restrict: 'E',
        replace: true,
        scope: {
          contacts: '=',
          toggleContact: '=',
          selectContact: '=',
          deleteContact: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('emailContactsNav', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/emailContactsNav.html',
        restrict: 'E',
        scope: {
          refreshMessages: '=',
          refreshContacts: '='
        },
        controller: [
          '$scope', '$rootScope', '$routeParams', '$translate', '$timeout', 'TeamraiserEmailService', 'ContactService', function($scope, $rootScope, $routeParams, $translate, $timeout, TeamraiserEmailService, ContactService) {
            var contactFilters, getContactCounts, getContactGroupTranslations, getContactGroups, getFilterTranslation, getMessageCounts, initContactGroups, messageTypes, updateContactGroupCount, updateContactGroupName;
            $scope.filter = $routeParams.filter || 'no_filter_defined';
            $scope.messageType = $routeParams.messageType || 'no_message_type';
            $scope.baseUrl = $rootScope.baseUrl;
            $scope.emailPromises = [];
            $scope.messageCounts = {};
            messageTypes = ['draft', 'sentMessage'];
            getMessageCounts = function() {
              return angular.forEach(messageTypes, function(messageType) {
                var apiMethod, messageCountPromise;
                apiMethod = 'get' + messageType.charAt(0).toUpperCase() + messageType.slice(1) + 's';
                messageCountPromise = TeamraiserEmailService[apiMethod]('list_page_size=1').then(function(response) {
                  $scope.messageCounts[messageType + 's'] = response.data[apiMethod + 'Response'].totalNumberResults;
                  return response;
                });
                return $scope.emailPromises.push(messageCountPromise);
              });
            };
            getMessageCounts();
            getFilterTranslation = function() {
              var filterNameKey;
              if ($scope.getFilterTranslationTimeout) {
                $timeout.cancel($scope.getFilterTranslationTimeout);
              }
              if ($scope.filter === 'no_filter_defined') {
                switch ($scope.messageType) {
                  case 'draft':
                    filterNameKey = 'drafts_drafts_label';
                    break;
                  case 'sentMessage':
                    filterNameKey = 'sent_sent_messages_label';
                    break;
                  default:
                    filterNameKey = 'compose_message_label';
                }
                return $translate(filterNameKey).then(function(translation) {
                  return $scope.filterName = translation;
                }, function(translationId) {
                  return $scope.getFilterTranslationTimeout = $timeout(getFilterTranslation, 500);
                });
              }
            };
            getFilterTranslation();
            $scope.contactGroups = [];
            contactFilters = ['email_rpt_show_all', 'email_rpt_show_never_emailed', 'email_rpt_show_nondonors_followup', 'email_rpt_show_unthanked_donors', 'email_rpt_show_donors', 'email_rpt_show_nondonors'];
            if ($rootScope.participantRegistration.previousEventParticipant === "true") {
              contactFilters.push('email_rpt_show_ly_donors');
              contactFilters.push('email_rpt_show_lybunt_donors');
            }
            if ($rootScope.participantRegistration.teamId !== "-1") {
              contactFilters.push('email_rpt_show_teammates');
              contactFilters.push('email_rpt_show_nonteammates');
              if ($rootScope.participantRegistration.previousEventParticipant === "true") {
                contactFilters.push('email_rpt_show_ly_teammates');
                contactFilters.push('email_rpt_show_ly_unreg_teammates');
              }
            }
            updateContactGroupName = function(filter, name) {
              return angular.forEach($scope.contactGroups, function(group) {
                if (filter === group.id) {
                  group.name = name;
                }
                if (filter === $scope.filter) {
                  return $scope.filterName = name;
                }
              });
            };
            updateContactGroupCount = function(filter, count) {
              return angular.forEach($scope.contactGroups, function(group) {
                if (filter === group.id) {
                  return group.num = count || '0';
                }
              });
            };
            getContactGroupTranslations = function() {
              var translationKeys;
              if ($scope.getContactGroupTranslationsTimeout) {
                $timeout.cancel($scope.getContactGroupTranslationsTimeout);
              }
              translationKeys = ['contacts_groups_all', 'filter_email_rpt_show_never_emailed', 'filter_email_rpt_show_nondonors_followup', 'filter_email_rpt_show_unthanked_donors', 'filter_email_rpt_show_donors', 'filter_email_rpt_show_nondonors', 'filter_email_rpt_show_ly_donors', 'filter_email_rpt_show_lybunt_donors', 'filter_email_rpt_show_teammates', 'filter_email_rpt_show_nonteammates', 'filter_email_rpt_show_ly_teammates', 'filter_email_rpt_show_ly_unreg_teammates'];
              return $translate(translationKeys).then(function(translations) {
                updateContactGroupName('email_rpt_show_all', translations.contacts_groups_all);
                updateContactGroupName('email_rpt_show_never_emailed', translations.filter_email_rpt_show_never_emailed);
                updateContactGroupName('email_rpt_show_nondonors_followup', translations.filter_email_rpt_show_nondonors_followup);
                updateContactGroupName('email_rpt_show_unthanked_donors', translations.filter_email_rpt_show_unthanked_donors);
                updateContactGroupName('email_rpt_show_donors', translations.filter_email_rpt_show_donors);
                updateContactGroupName('email_rpt_show_nondonors', translations.filter_email_rpt_show_nondonors);
                updateContactGroupName('email_rpt_show_ly_donors', translations.filter_email_rpt_show_ly_donors);
                updateContactGroupName('email_rpt_show_lybunt_donors', translations.filter_email_rpt_show_lybunt_donors);
                updateContactGroupName('email_rpt_show_teammates', translations.filter_email_rpt_show_teammates);
                updateContactGroupName('email_rpt_show_nonteammates', translations.filter_email_rpt_show_nonteammates);
                updateContactGroupName('email_rpt_show_ly_teammates', translations.filter_email_rpt_show_ly_teammates);
                return updateContactGroupName('email_rpt_show_ly_unreg_teammates', translations.filter_email_rpt_show_ly_unreg_teammates);
              }, function(translationIds) {
                return $scope.getContactGroupTranslationsTimeout = $timeout(getContactGroupTranslations, 500);
              });
            };
            getContactCounts = function() {
              return angular.forEach(contactFilters, function(filter) {
                var contactCountPromise;
                contactCountPromise = ContactService.getTeamraiserAddressBookContacts('tr_ab_filter=' + filter + '&skip_groups=true').then(function(response) {
                  updateContactGroupCount(filter, response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults);
                  return response;
                });
                return $scope.emailPromises.push(contactCountPromise);
              });
            };
            getContactGroups = function() {
              var getGroupsPromise;
              getGroupsPromise = ContactService.getAddressBookGroups('count_contacts=true').then(function(response) {
                var abgroups, ref;
                abgroups = (ref = response.data.getAddressBookGroupsResponse) != null ? ref.group : void 0;
                if (!angular.isArray(abgroups)) {
                  abgroups = [abgroups];
                }
                angular.forEach(abgroups, function(group) {
                  var filter;
                  if (group) {
                    filter = 'email_rpt_group_' + group.id;
                    $scope.contactGroups.push({
                      id: filter,
                      url: $rootScope.baseUrl + '#/email/contacts/' + filter + '/list',
                      num: group.contactsCount,
                      name: group.name
                    });
                    if (filter === $scope.filter) {
                      return $scope.filterName = group.name;
                    }
                  }
                });
                return response;
              });
              return $scope.emailPromises.push(getGroupsPromise);
            };
            initContactGroups = function() {
              $scope.contactGroups = [];
              angular.forEach(contactFilters, function(filter) {
                return $scope.contactGroups.push({
                  id: filter,
                  url: $rootScope.baseUrl + '#/email/contacts/' + filter + '/list',
                  num: '0',
                  name: ''
                });
              });
              getContactGroupTranslations();
              getContactCounts();
              return getContactGroups();
            };
            initContactGroups();
            $scope.$watch('refreshContacts', function(newValue, oldValue) {
              if (newValue && newValue !== oldValue) {
                return initContactGroups();
              }
            });
            return $scope.$watch('refreshMessages', function(newValue, oldValue) {
              if (newValue && newValue !== oldValue) {
                return getMessageCounts();
              }
            });
          }
        ]
      };
    }
  ]);

  angular.module('trPcApp').directive('emailMessageList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/emailMessageList.html',
        restrict: 'E',
        replace: true,
        scope: {
          messages: '=',
          selectMessage: '=',
          deleteMessage: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('giftList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/giftList.html',
        restrict: 'E',
        replace: true,
        scope: {
          gifts: '=',
          showActions: '=',
          acknowledgeGift: '&',
          thankDonor: '&',
          deleteGift: '&',
          giftActionLabels: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('iframeLoaded', function() {
    return {
      restrict: 'A',
      scope: {
        iframeLoaded: '='
      },
      link: function(scope, element, attrs) {
        return element.on('load', function() {
          return scope.iframeLoaded(element);
        });
      }
    };
  });

  angular.module('trPcApp').directive('importContactsList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/importContactsList.html',
        restrict: 'E',
        replace: true,
        scope: {
          contacts: '=',
          toggleContact: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('newsFeedList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/newsFeedList.html',
        restrict: 'E',
        replace: true,
        scope: {
          items: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('recentActivityList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/recentActivityList.html',
        restrict: 'E',
        replace: true,
        scope: {
          records: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('socialShare', [
    '$interval', 'SocialShareService', function($interval, SocialShareService) {
      return {
        template: '<div class="janrainSocialPlaceholder"></div>',
        restrict: 'E',
        replace: true,
        scope: {
          sharePage: '<'
        },
        link: function(scope, element, attrs) {
          if (scope.sharePage) {
            return SocialShareService.activateJanrain(element, scope.sharePage);
          } else {
            return scope.shareWatch = $interval(function() {
              if (scope.sharePage && scope.sharePage.match('http')) {
                SocialShareService.activateJanrain(element, scope.sharePage);
                return $interval.cancel(scope.shareWatch);
              }
            }, 1000);
          }
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('teamMemberList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/teamMemberList.html',
        restrict: 'E',
        replace: true,
        scope: {
          members: '='
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('teamsList', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/teamsList.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
          teams: '=',
          joinTeam: '&'
        }
      };
    }
  ]);

  angular.module('trPcApp').directive('topNav', [
    'APP_INFO', function(APP_INFO) {
      return {
        templateUrl: APP_INFO.rootPath + 'html/directive/topNav.html',
        restrict: 'E',
        replace: true
      };
    }
  ]);

}).call(this);
