angular.module 'trPcControllers'
  .controller 'EmailContactsListViewCtrl', [
    '$rootScope'
    '$scope'
    '$window'
    '$timeout'
    '$routeParams'
    '$location'
    '$httpParamSerializer'
    '$translate'
    '$filter'
    '$uibModal'
    'TeamraiserEmailService'
    'ContactService'
    'APP_INFO'
    ($rootScope, $scope, $window, $timeout, $routeParams, $location, $httpParamSerializer, $translate, $filter, $uibModal, TeamraiserEmailService, ContactService, APP_INFO) ->
      $scope.filter = $routeParams.filter
      if not $scope.filter or $scope.filter is ':filter'
        $scope.filter = 'email_rpt_show_all'
      $scope.refreshContactsNav = 0
      $scope.emailPromises = []

      getContactById = (contactId) ->
        contact = null
        if $scope.addressBookContacts.contacts.length > 0
          angular.forEach $scope.addressBookContacts.contacts, (currContact) ->
            if currContact.id is contactId
              contact = currContact
        contact

      if not $rootScope.selectedContacts?.contacts
        ContactService.resetSelectedContacts()

      $scope.addressBookNumPerPageOptions = [ 10, 25, 50, 100, 500 ]

      $scope.addressBookContacts = 
        page: 1
        numPerPage: 10
        maxContacts: 0
        totalNumber: 0
        searching: false
        contacts: []
        contactSearchInput: ''
      $scope.addressBookGroups = []
      $scope.contactSearchInput = ''
      $scope.allContactsSelected = false
      $scope.contactsSelected =
        all: (newVal) ->
          if arguments.length then $scope.allContactsSelected = newVal else $scope.allContactsSelected
      $scope.contactsUpdated = false

      getContactsTotal = ->
        getContactsTotalPromise = ContactService.getTeamraiserAddressBookContacts 'tr_ab_filter=email_rpt_show_all&skip_groups=true&list_page_size=10&list_page_offset=0'
          .then (response) ->
            $scope.addressBookContacts.maxContacts = response.data.getTeamraiserAddressBookContactsResponse?.totalNumberResults
            response
        $scope.emailPromises.push getContactsTotalPromise
      getContactsTotal()

      refreshContactsNavBar = ->
        getContactsTotal()
        $scope.refreshContactsNav = $scope.refreshContactsNav + 1

      $scope.refreshSelectedContacts = ->
        if $scope.addressBookContacts.contacts and $scope.addressBookContacts.contacts.length > 0
          $scope.numContactsSelected = $filter('filter')($scope.addressBookContacts.contacts, {selected: true}).length
          $scope.contactsSelected.all $scope.numContactsSelected is $scope.addressBookContacts.contacts.length
        else
          $scope.numContactsSelected = 0
          $scope.contactsSelected.all false
        $scope.contactsSelected.all()
      $scope.refreshSelectedContacts()
      $scope.$watchGroup ['addressBookContacts.contacts', 'contactsUpdated'], () ->
        $scope.refreshSelectedContacts()

      $scope.getContacts = ->
        pageNumber = $scope.addressBookContacts.page - 1
        numPerPage = $scope.addressBookContacts.numPerPage
        requestData = 'tr_ab_filter=' + $scope.filter + '&skip_groups=true&list_page_size=' + numPerPage + '&list_page_offset=' + pageNumber
        if $scope.contactSearchInput isnt ''
          requestData += '&list_filter_text=' + $scope.contactSearchInput
        contactsPromise = ContactService.getTeamraiserAddressBookContacts requestData
          .then (response) ->
            addressBookContacts = response.data.getTeamraiserAddressBookContactsResponse.addressBookContact
            addressBookContacts = [addressBookContacts] if not angular.isArray addressBookContacts
            $scope.addressBookContacts.contacts = []
            angular.forEach addressBookContacts, (contact) ->
              if contact
                contact.selected = ContactService.isInSelectedContacts contact
                $scope.addressBookContacts.contacts.push contact
            $scope.addressBookContacts.totalNumber = response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults
            response
        $scope.emailPromises.push contactsPromise
      $scope.getContacts()

      $scope.showDeleteGroup = false
      $scope.getGroups = ->
        getGroupsPromise = ContactService.getAddressBookGroups()
          .then (response) ->
            abgroups = response.data.getAddressBookGroupsResponse?.group
            abgroups = [abgroups] if not angular.isArray abgroups
            $scope.showDeleteGroup = false
            angular.forEach abgroups, (group) ->
              if group
                filter = 'email_rpt_group_' + group.id
                if $scope.filter is filter
                  $scope.filterName = group.name
                  $scope.showDeleteGroup = true
            $scope.addressBookGroups = abgroups
            response
        $scope.emailPromises.push getGroupsPromise

      updateContactFilterNames = ->
        if $scope.updateContactFilterNamesTimeout
          $timeout.cancel $scope.updateContactFilterNamesTimeout
        if $scope.filter is 'email_rpt_show_all'
          $translate 'contacts_groups_all'
            .then (translation) ->
              $scope.filterName = translation
            , (translationId) ->
              $scope.updateContactFilterNamesTimeout = $timeout updateContactFilterNames, 500
        else if $scope.filter.match 'email_rpt_group_'
          $scope.getGroups()
        else
          $translate 'filter_' + $scope.filter
            .then (translation) ->
              $scope.filterName = translation
            , (translationId) ->
              $scope.updateContactFilterNamesTimeout = $timeout updateContactFilterNames, 500
      updateContactFilterNames()

      $scope.searchContacts = ->
        $scope.addressBookContacts.page = 1
        $scope.getContacts()
        false
      
      $scope.clearAllContactAlerts = ->
        $scope.clearAddContactAlerts()
        $scope.clearImportContactsAlerts()
        $scope.clearEditContactAlerts()
        $scope.clearDeleteContactAlerts()
      
      $scope.clearAddContactAlerts = ->
        if $scope.addContactError
          delete $scope.addContactError
        if $scope.addContactSuccess
          delete $scope.addContactSuccess
      
      $scope.resetNewContact = ->
        $scope.newContact =
          first_name: ''
          last_name: ''
          email: ''
      
      $scope.addContact = ->
        $scope.clearAllContactAlerts()
        $scope.resetNewContact()
        $scope.addContactModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/addContact.html'
      
      closeAddContactModal = ->
        $scope.addContactModal.close()
      
      $scope.cancelAddContact = ->
        $scope.clearAddContactAlerts()
        closeAddContactModal()
      
      $scope.addNewContact = ->
        $scope.clearAddContactAlerts()
        if not $scope.newContact.email or $scope.newContact.email is ''
          $translate 'contact_add_failure_email'
            .then (translation) ->
              $scope.addContactError = translation
            , (translationId) ->
              $scope.addContactError = translationId
        else
          addContactPromise = ContactService.addAddressBookContact $httpParamSerializer($scope.newContact)
            .then (response) ->
              if response.data.errorResponse
                if response.data.errorResponse.message
                  $scope.addContactError = response.data.errorResponse.message
                else
                  $translate 'contact_add_failure_unknown'
                    .then (translation) ->
                      $scope.addContactError = translation
                    , (translationId) ->
                      $scope.addContactError = translationId
              else
                $translate 'contact_add_success'
                  .then (translation) ->
                    $scope.addContactSuccess = translation
                  , (translationId) ->
                    $scope.addContactSuccess = translationId
                closeAddContactModal()
                refreshContactsNavBar()
                $scope.getContacts()
              response
          $scope.emailPromises.push addContactPromise

      $scope.resetAddContactsToGroup = ->
        $scope.addContactGroupForm =
          groupId: ''
          groupName: ''
          errorMsg: null
        if $scope.addressBookGroups.length is 0
          $scope.getGroups()

      $scope.addContactsToGroup = ->
        $scope.resetAddContactsToGroup()
        selectedContacts = []
        angular.forEach $scope.addressBookContacts.contacts, (contact) ->
          if contact?.selected
            selectedContacts.push contact.id
        $scope.addContactGroupForm.contactIds = selectedContacts.join ','
        $scope.addContactsToGroupModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/addContactsToGroup.html'
      
      $scope.cancelAddContactsToGroup = ->
        $scope.addContactsToGroupModal.close()
      
      $scope.confirmAddContactsToGroup = ->
        delete $scope.addContactGroupForm.errorMsg
        if $scope.addContactGroupForm.groupId is '' and $scope.addContactGroupForm.groupName is ''
          $translate 'contact_add_to_group_warning'
            .then (translation) ->
              $scope.addContactGroupForm.errorMsg = translation
            , (translationId) ->
              $scope.addContactGroupForm.errorMsg = translationId
        else
          if $scope.addContactGroupForm.groupName isnt ''
            dataStr = 'group_name=' + encodeURIComponent($scope.addContactGroupForm.groupName) + '&contact_ids=' + $scope.addContactGroupForm.contactIds
            addContactGroupPromise = ContactService.addAddressBookGroup dataStr
              .then (response) ->
                if response.data.errorResponse
                  if response.data.errorResponse.message
                    $scope.addContactGroupForm.errorMsg = response.data.errorResponse.message
                  else
                    $translate 'contact_add_to_group_unknown_error'
                      .then (translation) ->
                        $scope.addContactGroupForm.errorMsg = translation
                      , (translationId) ->
                        $scope.addContactGroupForm.errorMsg = translationId
                else
                  refreshContactsNavBar()
                  $scope.cancelAddContactsToGroup()
                response
            $scope.emailPromises.push addContactGroupPromise
          else
            dataStr = 'group_id=' + $scope.addContactGroupForm.groupId + '&contact_ids=' + $scope.addContactGroupForm.contactIds
            addContactGroupPromise = ContactService.addContactsToGroup dataStr
              .then (response) ->
                if response.data.errorResponse
                  if response.data.errorResponse.message
                    $scope.addContactGroupForm.errorMsg = response.data.errorResponse.message
                  else
                    $translate 'contact_add_to_group_unknown_error'
                      .then (translation) ->
                        $scope.addContactGroupForm.errorMsg = translation
                      , (translationId) ->
                        $scope.addContactGroupForm.errorMsg = translationId
                else
                  refreshContactsNavBar()
                  $scope.cancelAddContactsToGroup()
                response
            $scope.emailPromises.push addContactGroupPromise

      $scope.deleteContactGroup = ->
        delete $scope.deleteContactGroupError
        $scope.deleteContactGroupId = $scope.filter.replace('email_rpt_group_', '')
        $scope.deleteContactGroupModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/deleteContactGroup.html'

      $scope.cancelDeleteContactGroup = ->
        delete $scope.deleteContactGroupError
        delete $scope.deleteContactGroupId
        $scope.deleteContactGroupModal.close()

      $scope.confirmDeleteContactGroup = ->
        deleteContactGroupPromise = ContactService.deleteAddressBookGroups 'group_ids=' + $scope.deleteContactGroupId
          .then (response) ->
            if response.data.errorResponse
              if response.data.errorResponse.message
                $scope.deleteContactGroupError = response.data.errorResponse.message
              else
                $translate 'contact_delete_group_unknown_error'
                  .then (translation) ->
                    $scope.deleteContactGroupError = translation
                  , (translationId) ->
                    $scope.deleteContactGroupError = translationId
            else
              $scope.cancelDeleteContactGroup()
              $location.path '/email/contacts'
        $scope.emailPromises.push deleteContactGroupPromise

      $scope.clearImportContactsAlerts = ->
        if $scope.importContactsError
          delete $scope.importContactsError
        if $scope.importContactsSuccess
          delete $scope.importContactsSuccess
      
      $scope.resetImportContacts = ->
        $scope.contactImport = 
          step: 'choose-type'
          import_type: ''
          jobEvents: []
          contactsToAdd: []
        $translate 'contact_import_consent_needed'
          .then (translation) ->
            $scope.contactImport.jobEvents = []
            $scope.contactImport.jobEvents.push
              message: translation
          , (translationId) ->
            $scope.contactImport.jobEvents = []
            $scope.contactImport.jobEvents.push
              message: translationId
      
      $scope.importContacts = ->
        $scope.clearAllContactAlerts()
        $scope.resetImportContacts()
        $scope.importContactsModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/importContacts.html'
      
      closeImportContactsModal = ->
        $scope.importContactsModal.close()
      
      $scope.cancelImportContacts = ->
        $scope.clearImportContactsAlerts()
        closeImportContactsModal()
      
      $scope.chooseImportContactType = ->
        importType = $scope.contactImport.import_type
        if not importType or importType is ''
          # TODO: error message
        else
          if importType is 'csv'
            $scope.contactImport.step = 'csv-upload'
          else
            $scope.contactImport.step = 'online-consent'
            $window.open APP_INFO.rootPath + 'html/popup/address-book-import.html?import_source=' + $scope.contactImport.import_type, 'startimport', 'location=no,menubar=no,toolbar=no,height=400'
            return false
      
      window.trPcContactImport = 
        buildAddressBookImport: (importJobId) ->
          ContactService.getAddressBookImportJobStatus 'import_job_id=' + importJobId
            .then (response) ->
              if response.data.errorResponse
                # TODO
              else
                jobStatus = response.data.getAddressBookImportJobStatusResponse?.jobStatus
                if not jobStatus
                  # TODO
                else
                  if jobStatus is 'PENDING'
                    events = response.data.getAddressBookImportJobStatusResponse.events?.event
                    if not events
                      $scope.updateImportJobEvents()
                    else
                      events = [events] if not angular.isArray events
                      jobEvents = []
                      angular.forEach events, (event) ->
                        jobEvents.push 
                          message: event
                      $scope.updateImportJobEvents jobEvents
                    trPcContactImport.buildAddressBookImport importJobId
                  else if jobStatus is 'SUCCESS'
                    ContactService.getAddressBookImportContacts 'import_job_id=' + importJobId
                      .then (response) ->
                        if response.data.errorResponse
                          # TODO
                        else
                          contacts = response.data.getAddressBookImportContactsResponse?.contact
                          if not contacts
                            $scope.setContactsAvailableForImport()
                          else
                            contacts = [contacts] if not angular.isArray contacts
                            contactsAvailableForImport = []
                            angular.forEach contacts, (contact) ->
                              firstName = contact.firstName
                              lastName = contact.lastName
                              email = contact.email
                              if firstName and not angular.isString firstName
                                delete contact.firstName
                              if lastName and not angular.isString lastName
                                delete contact.lastName
                              if email and not angular.isString email
                                delete contact.email
                              contactsAvailableForImport.push contact
                            $scope.setContactsAvailableForImport contactsAvailableForImport

      getImportContactString = (contact) ->
        contactData = ''
        if contact.firstName
          contactData += '"' + contact.firstName + '"'
        contactData += ', '
        if contact.lastName
          contactData += '"' + contact.lastName + '"'
        contactData += ', '
        if contact.email
          contactData += '"' + contact.email + '"'
        contactData
      
      $scope.updateImportJobEvents = (jobEvents) ->
        if jobEvents and jobEvents.length isnt 0
          $scope.contactImport.jobEvents = jobEvents
        if not $scope.$$phase
          $scope.$apply()
      
      $scope.setContactsAvailableForImport = (contactsAvailableForImport) ->
        $scope.contactImport.step = 'contacts-available-for-import'
        $scope.contactsAvailableForImport = contactsAvailableForImport or []
        if not $scope.$$phase
          $scope.$apply()
      
      $scope.selectAllContactsToAdd = ($event) ->
        if $event
          $event.preventDefault()
        contactsAvailableForImport = []
        $scope.contactImport.contactsToAdd = []
        angular.forEach $scope.contactsAvailableForImport, (contactAvailableForImport) ->
          contactAvailableForImport.selected = true
          contactsAvailableForImport.push contactAvailableForImport
          $scope.contactImport.contactsToAdd.push getImportContactString contactAvailableForImport
        $scope.contactsAvailableForImport = contactsAvailableForImport
      
      $scope.deselectAllContactsToAdd = ($event) ->
        if $event
          $event.preventDefault()
        contactsAvailableForImport = []
        angular.forEach $scope.contactsAvailableForImport, (contactAvailableForImport) ->
          contactAvailableForImport.selected = false
          contactsAvailableForImport.push contactAvailableForImport
        $scope.contactsAvailableForImport = contactsAvailableForImport
        $scope.contactImport.contactsToAdd = []
      
      $scope.toggleContactToAdd = (contact) ->
        contactToAddIndex = $scope.contactImport.contactsToAdd.indexOf getImportContactString contact
        if contactToAddIndex is -1
          $scope.contactImport.contactsToAdd.push contactData
        else
          $scope.contactImport.contactsToAdd.splice contactToAddIndex, 1
      
      $scope.chooseContactsToImport = ->
        $scope.clearImportContactsAlerts()
        if $scope.contactImport.contactsToAdd.length is 0
          $translate 'addressbookimport_selectcontacts_none_selected_failure'
            .then (translation) ->
              $scope.importContactsError = translation
            , (translationId) ->
              $scope.importContactsError = translationId
        else
          ContactService.importAddressBookContacts 'contacts_to_add=' + encodeURIComponent($scope.contactImport.contactsToAdd.join('\n'))
            .then (response) ->
              if response.data.errorResponse
                $scope.importContactsError = response.data.errorResponse.message
              else
                errorContacts = response.data.importAddressBookContactsResponse?.errorContact
                if errorContacts
                  errorContacts = [errorContacts] if not angular.isArray errorContacts
                potentialDuplicateContacts = response.data.importAddressBookContactsResponse?.potentialDuplicateContact
                if potentialDuplicateContacts
                  potentialDuplicateContacts = [potentialDuplicateContacts] if not angular.isArray potentialDuplicateContacts
                duplicateContacts = response.data.importAddressBookContactsResponse?.duplicateContact
                if duplicateContacts
                  duplicateContacts = [duplicateContacts] if not angular.isArray duplicateContacts
                savedContacts = response.data.importAddressBookContactsResponse?.savedContact
                if savedContacts
                  savedContacts = [savedContacts] if not angular.isArray savedContacts
                # TODO: handle errorContacts, potentialDuplicateContacts, and duplicateContacts
                $scope.importContactsSuccess = true
                closeImportContactsModal()
                refreshContactsNavBar()
                $scope.getContacts()
      
      $scope.uploadContactsCSV = ->
        angular.element(document).find('.js--import-contacts-csv-form').submit()
        return false
      
      $scope.handleContactsCSV = (csvIframe) ->
        csvIframeContent = jQuery(csvIframe).contents().text()
        if csvIframeContent
          csvIframeJSON = jQuery.parseJSON csvIframeContent
          if csvIframeJSON.errorResponse
            # TODO
          else
            confidenceLevel = csvIframeJSON.parseCsvContactsResponse?.confidenceLevel
            # TODO: do something with confidenceLevel
            proposedMapping = csvIframeJSON.parseCsvContactsResponse?.proposedMapping
            if proposedMapping
              firstNameColumnIndex = Number proposedMapping.firstNameColumnIndex
              lastNameColumnIndex = Number proposedMapping.lastNameColumnIndex
              emailColumnIndex = Number proposedMapping.emailColumnIndex
              csvDataRows = csvIframeJSON.parseCsvContactsResponse?.csvDataRows?.csvDataRow
              if not csvDataRows
                # TODO
              else
                csvDataRows = [csvDataRows] if not angular.isArray csvDataRows
                contactsAvailableForImport = []
                angular.forEach csvDataRows, (csvDataRow) ->
                  csvValue = csvDataRow.csvValue
                  firstName = csvValue[firstNameColumnIndex]
                  lastName = csvValue[lastNameColumnIndex]
                  email = csvValue[emailColumnIndex]
                  contact =
                    firstName: firstName
                    lastName: lastName
                    email: email
                  if firstName and not angular.isString firstName
                    delete contact.firstName
                  if lastName and not angular.isString lastName
                    delete contact.lastName
                  if email and not angular.isString email
                    delete contact.email
                  contactsAvailableForImport.push contact
                $scope.setContactsAvailableForImport contactsAvailableForImport
      
      $scope.toggleContact = (contactId) ->
        contact = getContactById contactId
        contactSelected = ContactService.isInSelectedContacts contact
        if not contactSelected
          # add contact to selectedContacts
          contact.selected = true
          ContactService.addToSelectedContacts contact
        else
          # remove contact from selectedContacts
          contact.selected = false
          ContactService.removeFromSelectedContacts contact
        $scope.contactsUpdated = !$scope.contactsUpdated

      $scope.toggleAllContacts = () ->
        selectToggle = $scope.contactsSelected.all()
        angular.forEach $scope.addressBookContacts.contacts, (contact) ->
          if contact.selected isnt selectToggle
            $scope.toggleContact contact.id
        $scope.contactsSelected.all selectToggle
      
      $scope.clearEditContactAlerts = ->
        if $scope.editContactError
          delete $scope.editContactError
        if $scope.editContactSuccess
          delete $scope.editContactSuccess
      
      $scope.selectContact = (contactId) ->
        $scope.clearAllContactAlerts()
        contact = getContactById contactId
        $scope.editContactMode = false
        $scope.viewContact = angular.copy contact
        $scope.updatedContact = 
          contact_id: contact.id
          first_name: contact.firstName
          last_name: contact.lastName
          email: contact.email
          street1: contact.street1
          street2: contact.street2
          city: contact.city
          state: contact.state
          zip: contact.zip
          country: contact.country
        $scope.editContactModal = $uibModal.open
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/editContact.html'
      
      closeEditContactModal = ->
        $scope.editContactModal.close()
      
      $scope.cancelEditContact = ->
        delete $scope.editContactMode
        delete $scope.viewContact
        delete $scope.updatedContact
        $scope.clearEditContactAlerts()
        closeEditContactModal()

      $scope.toggleEditContact = () ->
        $scope.editContactMode = not $scope.editContactMode
      
      $scope.saveUpdatedContact = ->
        $scope.clearEditContactAlerts()
        if not $scope.updatedContact
          # TODO
        else
          updateContactPromise = ContactService.updateTeamraiserAddressBookContact $httpParamSerializer($scope.updatedContact)
            .then (response) ->
              if response.data.errorResponse
                if response.data.errorResponse.message
                  $scope.editContactError = response.data.errorResponse.message
                else
                  $translate 'contact_add_failure_unknown'
                    .then (translation) ->
                      $scope.editContactError = translation
                    , (translationId) ->
                      $scope.editContactError = translationId
              else
                $translate 'contact_edit_success'
                  .then (translation) ->
                    $scope.editContactSuccess = translation
                  , (translationId) ->
                    $scope.editContactSuccess = translation
                closeEditContactModal()
                $rootScope.scrollToTop()
                refreshContactsNavBar()
                $scope.getContacts()
              response
          $scope.emailPromises.push updateContactPromise
      
      $scope.clearDeleteContactAlerts = ->
        if $scope.deleteContactError
          delete $scope.deleteContactError
        if $scope.deleteContactSuccess
          delete $scope.deleteContactSuccess

      closeDeleteContactModal = ->
        delete $scope.contactsToDelete
        if $scope.deleteContactModal
          $scope.deleteContactModal.close()
        $rootScope.scrollToTop()

      showDeleteContactError = () ->
        $translate 'contacts_warn_delete_failure_body'
          .then (translation) ->
            $scope.deleteContactError = translation
          , (translationId) ->
            $scope.deleteContactError = translationId
        closeDeleteContactModal()

      openDeleteContactModal = () ->
        $scope.clearDeleteContactAlerts()
        if $scope.contactsToDelete
          $scope.deleteContactModal = $uibModal.open 
            scope: $scope
            templateUrl: APP_INFO.rootPath + 'html/modal/deleteContact.html'
        else
          showDeleteContactError()
      
      $scope.deleteContact = (contactId) ->
        $scope.contactsToDelete = []
        $scope.contactsToDelete.push getContactById(contactId)
        openDeleteContactModal()
      
      $scope.deleteSelectedContacts = () ->
        $scope.contactsToDelete = angular.copy $rootScope.selectedContacts.contacts
        openDeleteContactModal()

      $scope.cancelDeleteContact = ->
        closeDeleteContactModal()
      
      $scope.confirmDeleteContact = ->
        if not $scope.contactsToDelete
          showDeleteContactError()
        else
          contactIds = []
          angular.forEach $scope.contactsToDelete, (contact) ->
            if contact.id
              contactIds.push contact.id
          deleteContactPromise = ContactService.deleteTeamraiserAddressBookContacts 'contact_ids=' + contactIds.toString()
            .then (response) ->
              if response.data.errorResponse
                if response.data.errorResponse.message
                  $scope.deleteContactError = response.data.errorResponse.message
                else
                  $translate 'contacts_warn_delete_failure_body'
                    .then (translation) ->
                      $scope.deleteContactError = translation
                    , (translationId) ->
                      $scope.deleteContactError = translationId
              else
                $translate 'contacts_delete_success'
                  .then (translation) ->
                    $scope.deleteContactSuccess = translation
                  , (translationId) ->
                    $scope.deleteContactSuccess = translationId
              ContactService.resetSelectedContacts()
              closeDeleteContactModal()
              $rootScope.scrollToTop()
              refreshContactsNavBar()
              $scope.getContacts()
              response
          $scope.emailPromises.push deleteContactPromise
      
      $scope.emailSelectedContacts = ->
        $location.path '/email/compose'

      if $scope.filter is 'email_rpt_show_all'
        emailAllButtonKey = 'contacts_email_all_button'
      else
        emailAllButtonKey = 'contacts_email_group_button'
      $translate emailAllButtonKey
        .then (translation) ->
          $scope.emailAllButtonLabel = translation
        , (translationId) ->
          $scope.emailAllButtonLabel = translationId

      $scope.emailAllContacts = ->
        $location.path '/email/compose/group/' + $scope.filter
  ]