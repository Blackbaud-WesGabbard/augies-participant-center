/* jshint strict:false */

module.exports = {
  "src": {
    files: [
      {
        expand: true, 
        cwd: 'dist/html/', 
        src: [
          '**/*'
        ]
      }, 
      {
        expand: true, 
        cwd: 'dist/css/', 
        src: [
          '**/*'
        ]
      }, 
      {
        expand: true, 
        cwd: 'dist/js/', 
        src: [
          '**/*'
        ]
      }, 
      {
        expand: true, 
        cwd: 'dist/translation/', 
        src: [
          '**/*'
        ]
      }
    ]
  }
}