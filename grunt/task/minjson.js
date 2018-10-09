/* jshint strict:false */

module.exports = {
  "src": {
    files: [
      {
        expand: true, 
        cwd: 'src/translation/', 
        src: [
          '*.json'
        ], 
        dest: 'dist/translation/'
      }
    ]
  }
}