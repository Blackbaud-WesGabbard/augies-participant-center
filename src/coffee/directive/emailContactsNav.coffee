angular.module 'trPcApp'
  .directive 'emailContactsNav', [ 'APP_INFO', (APP_INFO) ->
    templateUrl: APP_INFO.rootPath + 'html/directive/emailContactsNav.html'
    restrict: 'E'
    scope:
      refreshMessages: '='
      refreshContacts: '='
    controller: [
      '$scope'
      '$rootScope'
      '$routeParams'
      '$translate'
      '$timeout'
      'TeamraiserEmailService'
      'ContactService'
      ($scope, $rootScope, $routeParams, $translate, $timeout, TeamraiserEmailService, ContactService) ->
        $scope.filter = $routeParams.filter or 'no_filter_defined'
        $scope.messageType = $routeParams.messageType or 'no_message_type'
        $scope.baseUrl = $rootScope.baseUrl
        $scope.emailPromises = []

        $scope.messageCounts = {}
        messageTypes = [
          'draft'
          'sentMessage'
        ]
        getMessageCounts = ->
          angular.forEach messageTypes, (messageType) ->
            apiMethod = 'get' + messageType.charAt(0).toUpperCase() + messageType.slice(1) + 's'
            messageCountPromise = TeamraiserEmailService[apiMethod] 'list_page_size=1'
              .then (response) ->
                $scope.messageCounts[messageType + 's'] = response.data[apiMethod + 'Response'].totalNumberResults
                response
            $scope.emailPromises.push messageCountPromise
        getMessageCounts()

        getFilterTranslation = ->
          if $scope.getFilterTranslationTimeout
            $timeout.cancel $scope.getFilterTranslationTimeout
          if $scope.filter is 'no_filter_defined'
            switch $scope.messageType
              when 'draft' then filterNameKey = 'drafts_drafts_label'
              when 'sentMessage' then filterNameKey = 'sent_sent_messages_label'
              else filterNameKey = 'compose_message_label'
            $translate filterNameKey
              .then (translation) ->
                $scope.filterName = translation
              , (translationId) ->
                $scope.getFilterTranslationTimeout = $timeout getFilterTranslation, 500
        getFilterTranslation()

        $scope.contactGroups = []
        contactFilters = [
          'email_rpt_show_all'
          'email_rpt_show_never_emailed'
          'email_rpt_show_nondonors_followup'
          'email_rpt_show_unthanked_donors'
          'email_rpt_show_donors'
          'email_rpt_show_nondonors'
        ]

        if $rootScope.participantRegistration.previousEventParticipant is "true"
          contactFilters.push 'email_rpt_show_ly_donors'
          contactFilters.push 'email_rpt_show_lybunt_donors'

        if $rootScope.participantRegistration.teamId isnt "-1"
          contactFilters.push 'email_rpt_show_teammates'
          contactFilters.push 'email_rpt_show_nonteammates'
          if $rootScope.participantRegistration.previousEventParticipant is "true"
            contactFilters.push 'email_rpt_show_ly_teammates'
            contactFilters.push 'email_rpt_show_ly_unreg_teammates'

        updateContactGroupName = (filter, name) ->
          angular.forEach $scope.contactGroups, (group) ->
            if filter is group.id
              group.name = name
            if filter is $scope.filter
              $scope.filterName = name

        updateContactGroupCount = (filter, count) ->
          angular.forEach $scope.contactGroups, (group) ->
            if filter is group.id
              group.num = count or '0'

        getContactGroupTranslations = ->
          if $scope.getContactGroupTranslationsTimeout
            $timeout.cancel $scope.getContactGroupTranslationsTimeout
          translationKeys = [
           'contacts_groups_all'
           'filter_email_rpt_show_never_emailed'
           'filter_email_rpt_show_nondonors_followup'
           'filter_email_rpt_show_unthanked_donors'
           'filter_email_rpt_show_donors'
           'filter_email_rpt_show_nondonors'
           'filter_email_rpt_show_ly_donors'
           'filter_email_rpt_show_lybunt_donors'
           'filter_email_rpt_show_teammates'
           'filter_email_rpt_show_nonteammates'
           'filter_email_rpt_show_ly_teammates'
           'filter_email_rpt_show_ly_unreg_teammates'
          ]
          $translate translationKeys
            .then (translations) ->
              updateContactGroupName 'email_rpt_show_all', translations.contacts_groups_all
              updateContactGroupName 'email_rpt_show_never_emailed', translations.filter_email_rpt_show_never_emailed
              updateContactGroupName 'email_rpt_show_nondonors_followup', translations.filter_email_rpt_show_nondonors_followup
              updateContactGroupName 'email_rpt_show_unthanked_donors', translations.filter_email_rpt_show_unthanked_donors
              updateContactGroupName 'email_rpt_show_donors', translations.filter_email_rpt_show_donors
              updateContactGroupName 'email_rpt_show_nondonors', translations.filter_email_rpt_show_nondonors
              updateContactGroupName 'email_rpt_show_ly_donors', translations.filter_email_rpt_show_ly_donors
              updateContactGroupName 'email_rpt_show_lybunt_donors', translations.filter_email_rpt_show_lybunt_donors
              updateContactGroupName 'email_rpt_show_teammates', translations.filter_email_rpt_show_teammates
              updateContactGroupName 'email_rpt_show_nonteammates', translations.filter_email_rpt_show_nonteammates
              updateContactGroupName 'email_rpt_show_ly_teammates', translations.filter_email_rpt_show_ly_teammates
              updateContactGroupName 'email_rpt_show_ly_unreg_teammates', translations.filter_email_rpt_show_ly_unreg_teammates
            , (translationIds) ->
              $scope.getContactGroupTranslationsTimeout = $timeout getContactGroupTranslations, 500

        getContactCounts = ->
          angular.forEach contactFilters, (filter) ->
            contactCountPromise = ContactService.getTeamraiserAddressBookContacts 'tr_ab_filter=' + filter + '&skip_groups=true'
              .then (response) ->
                updateContactGroupCount filter, response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults
                response
            $scope.emailPromises.push contactCountPromise

        getContactGroups = ->
          getGroupsPromise = ContactService.getAddressBookGroups 'count_contacts=true'
            .then (response) ->
              abgroups = response.data.getAddressBookGroupsResponse?.group
              abgroups = [abgroups] if not angular.isArray abgroups
              angular.forEach abgroups, (group) ->
                if group
                  filter = 'email_rpt_group_' + group.id
                  $scope.contactGroups.push
                    id: filter
                    url: $rootScope.baseUrl + '#/email/contacts/' + filter + '/list'
                    num: group.contactsCount
                    name: group.name
                  if filter is $scope.filter
                    $scope.filterName = group.name
              response
          $scope.emailPromises.push getGroupsPromise

        initContactGroups = ->
          $scope.contactGroups = []
          angular.forEach contactFilters, (filter) ->
            $scope.contactGroups.push
              id: filter
              url: $rootScope.baseUrl + '#/email/contacts/' + filter + '/list'
              num: '0'
              name: ''
          getContactGroupTranslations()
          getContactCounts()
          getContactGroups()
        initContactGroups()

        $scope.$watch 'refreshContacts', (newValue, oldValue) ->
          if newValue and newValue isnt oldValue
            initContactGroups()

        $scope.$watch 'refreshMessages', (newValue, oldValue) ->
          if newValue and newValue isnt oldValue
            getMessageCounts()
    ]
  ]