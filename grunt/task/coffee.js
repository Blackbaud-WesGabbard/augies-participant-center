/* jshint strict:false */

module.exports = {
  options: {
    join: true
  }, 
  
  "src": {
    files: {
      'dist/js/main.js': [
        'src/coffee/init.coffee', 
        'src/coffee/config/*.*', 
        'src/coffee/service/*.*', 
        'src/coffee/**/*.*'
      ]
    }
  }
}