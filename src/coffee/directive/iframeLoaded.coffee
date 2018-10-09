angular.module 'trPcApp'
  .directive 'iframeLoaded', ->
    restrict: 'A'
    scope:
      iframeLoaded: '='
    link: (scope, element, attrs) ->
      element.on 'load', ->
        scope.iframeLoaded(element)