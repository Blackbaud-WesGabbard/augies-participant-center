module.exports = (grunt) ->
  'use strict'
  
  require('time-grunt') grunt
  
  config = {}
  loadConfig = (path) ->
    glob = require 'glob'
    object = {}
    glob.sync '*',
      cwd: path
    .forEach (option) ->
      key = option.replace /\.js$/, ''
      object[key] = require path + option
      return
    object
  grunt.util._.extend config, loadConfig('./grunt/task/')
  grunt.initConfig config
  require('load-grunt-tasks') grunt
  
  runTargetedTask = (tasks, taskTarget) ->
    if taskTarget
      i = 0
      while i < tasks.length
        if config[tasks[i]][taskTarget]
          tasks[i] += ':' + taskTarget
        i++
    grunt.task.run tasks
    return
  
  grunt.registerTask 'html-dist', (taskTarget) ->
    runTargetedTask [
      'htmlmin'
    ], taskTarget
  grunt.registerTask 'css-dist', (taskTarget) ->
    runTargetedTask [
      'sass'
      'cssmin'
    ], taskTarget
  grunt.registerTask 'js-dist', (taskTarget) ->
    runTargetedTask [
      'coffee'
      'uglify'
    ], taskTarget
  grunt.registerTask 'json-dist', (taskTarget) ->
    runTargetedTask [
      'minjson'
    ], taskTarget
  grunt.registerTask 'default', [
    'watch'
  ]