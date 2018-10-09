angular.module 'trPcApp'
  .factory 'PageBuilderService', [
    '$rootScope'
    '$http'
    '$q'
    '$timeout'
    '$document'
    ($rootScope, $http, $q, $timeout, $document) ->
      getPageContent: (pbPageName, useCache, additionalArguments) ->
        if not $rootScope.pageBuilderCache
          $rootScope.pageBuilderCache = {}
        if useCache and $rootScope.pageBuilderCache[pbPageName]
          deferred = $q.defer()
          deferred.resolve $rootScope.pageBuilderCache[pbPageName]
          deferred.promise
        else
          dataString = 'pagename=getPageBuilderPageContent&pgwrap=n'
          dataString += '&pb_page_name=' + pbPageName if pbPageName
          if additionalArguments
            dataString += '&' + additionalArguments
          $http
            method: 'GET'
            url: 'SPageServer?' + dataString
            headers:
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          .then (response) ->
            if pbPageName
              $rootScope.pageBuilderCache[pbPageName] = response
              response

      loadScript: (url) ->
        deferred = $q.defer()
        document = $document[0]
        scriptTag = document.createElement('script')
        scriptTag.src = url
        scriptTag.type = 'text/javascript'
        scriptTag.onload = (e) ->
          $timeout () ->
            deferred.resolve e
        scriptTag.onreadystatechange = (e) ->
          if this.readyState 
            if this.readyState is 'complete' or this.readyState is 'loaded'
              $timeout () ->
                deferred.resolve e
        scriptTag.onerror = (e) ->
          $timeout () ->
            deferred.reject e
        document.body.appendChild scriptTag
        deferred.promise
  ]