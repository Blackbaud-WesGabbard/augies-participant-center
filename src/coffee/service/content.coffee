angular.module 'trPcApp'
  .factory 'ContentService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      getMessageBundle: (requestData) ->
        dataString = 'method=getMessageBundle'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.contentRequest dataString, false
          .then (response) ->
            response
  ]

angular.module 'trPcApp'
  .factory 'useMessageCatalog', [
    '$q'
    '$http'
    'ContentService'
    ($q, $http, ContentService) ->
      (options) ->
        deferred = $q.defer()
        loadFile = (file) ->
          if not file or not angular.isString file.prefix or not angular.isString file.suffix
            throw new Error "Couldn't load static file, no prefix or suffix specified"
          $http angular.extend {
            url: [
              file.prefix
              options.key
              file.suffix
            ].join('')
            method: 'GET'
            params: ''
          }, options.$http
            .then (result) ->
              result.data
            , () ->
              $q.reject options.key
        loadMsgCat = (data) ->
          if not data?.keys or not angular.isArray data.keys
            throw new Error "Couldn't load message catalog bundle, no keys specified"
          dataStr = 'bundle='
          if data?.bundle
            dataStr += data.bundle
          else
            dataStr += 'trpc'
          dataStr += '&keys=' + data?.keys?.toString() if data?.keys and angular.isArray data.keys
          ContentService.getMessageBundle dataStr
            .then (response) ->
              messageBundle = {}
              stripHtml = (text) ->
                String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/gm,' ') unless not text
              if response?.data?.getMessageBundleResponse?.values
                messageValues = response.data.getMessageBundleResponse.values
                messageValues = [messageValues] if not angular.isArray messageValues
                messageBundle[msg.key] = stripHtml msg.value for msg in messageValues
              messageBundle
        if options?.messages and angular.isArray options.messages
          promises = []
          for message in options.messages
            switch message.type
              when 'file' then promises.push loadFile message
              when 'msgCat' then promises.push loadMsgCat message
              else throw new Error "Unrecognized message.type: " + message.type
          $q.all promises
            .then (data) ->
              mergeData = {}
              angular.extend mergeData, resp for resp in data
              deferred.resolve mergeData
        else
          throw new Error "Couldn't load messages using message catalog, no messages provided."
          deferred.reject(options.key)
        deferred.promise
  ]