/* jshint strict:false */

module.exports = {
  "grunt-config": {
    files: [
      'Gruntfile.js', 
      'grunt/task/*.js', 
      'grunt/.jshintrc'
    ], 
    tasks: [
      'jshint:grunt-config', 
      'notify:grunt-config'
    ]
  }, 
  
  "src": {
    files: [
      'src/html/**/*', 
      'src/sass/**/*', 
      'src/coffee/**/*', 
      'src/translation/**/*'
    ], 
    tasks: [
      'clean', 
      'html-dist', 
      'css-dist', 
      'js-dist', 
      'jshint:src-json', 
      'json-dist', 
      'notify:src'
    ]
  }
}