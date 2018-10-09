angular.module 'trPcApp'
  .factory 'ContactService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      addAddressBookContact: (requestData) ->
        dataString = 'method=addAddressBookContact'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true
          .then (response) ->
            response
      
      getAddressBookImportJobStatus: (requestData) ->
        dataString = 'method=getAddressBookImportJobStatus'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true, true
          .then (response) ->
            response
      
      getAddressBookImportContacts: (requestData) ->
        dataString = 'method=getAddressBookImportContacts'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true, true
          .then (response) ->
            response
      
      importAddressBookContacts: (requestData) ->
        dataString = 'method=importAddressBookContacts'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true, true
          .then (response) ->
            response
      
      addAddressBookGroup: (requestData) ->
        dataString = 'method=addAddressBookGroup'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true
          .then (response) ->
            response
      
      addContactsToGroup: (requestData) ->
        dataString = 'method=addContactsToGroup'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true
          .then (response) ->
            response

      deleteAddressBookGroups: (requestData) ->
        dataString = 'method=deleteAddressBookGroups'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true
          .then (response) ->
            response
      
      deleteTeamraiserAddressBookContacts: (requestData) ->
        dataString = 'method=deleteTeamraiserAddressBookContacts'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      updateTeamraiserAddressBookContact: (requestData) ->
        dataString = 'method=updateTeamraiserAddressBookContact'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getAddressBookGroups: (requestData) ->
        dataString = 'method=getAddressBookGroups'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.addressBookRequest dataString, true
          .then (response) ->
            response

      getTeamraiserAddressBookFilters: (requestData) ->
        dataString = 'method=getTeamraiserAddressBookFilters'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getTeamraiserAddressBookContacts: (requestData) ->
        dataString = 'method=getTeamraiserAddressBookContacts'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getTeamraiserAddressBookContact: (requestData) ->
        dataString = 'method=getTeamraiserAddressBookContact'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response

      getTeamraiserAddressBookGroupContacts: (requestData) ->
        dataString = 'method=getTeamraiserAddressBookGroupContacts'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response

      getContactString: (contact) ->
        contactData = ''
        if contact.firstName
          contactData += contact.firstName
        if contact.lastName
          if contactData isnt ''
            contactData += ' '
          contactData += contact.lastName
        if contact.email
          if contactData isnt ''
            contactData += ' '
          contactData += '<' + contact.email + '>'
        contactData

      resetSelectedContacts: ->
        $rootScope.selectedContacts = 
          contacts: []

      getNumSelectedContacts: ->
        if not $rootScope.selectedContacts?.contacts
          this.resetSelectedContacts()
        $rootScope.selectedContacts.contacts.length

      isInSelectedContacts: (testContact) ->
        found = false
        if testContact? and testContact.id?
          angular.forEach $rootScope.selectedContacts.contacts, (contact) ->
            if contact? and contact.id is testContact.id
              found = true
        found

      addToSelectedContacts: (addContact) ->
        if not this.isInSelectedContacts addContact
          $rootScope.selectedContacts.contacts.push addContact
        addContact

      removeFromSelectedContacts: (removeContact) ->
        ind = -1
        if removeContact? and removeContact.id?
          angular.forEach $rootScope.selectedContacts.contacts, (contact, key) ->
            if contact? and contact.id is removeContact.id
              ind = key
          if ind >= 0
            $rootScope.selectedContacts.contacts.splice ind, 1
        removeContact
  ]