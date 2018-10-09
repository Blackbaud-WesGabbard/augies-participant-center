/* jshint strict:false */

module.exports = {
  options: {
    collapseBooleanAttributes: true, 
    collapseWhitespace: true, 
    minifyCSS: true, 
    minifyJS: true, 
    removeComments: true, 
    removeEmptyAttributes: true, 
    removeScriptTypeAttributes: true, 
    removeStyleLinkTypeAttributes: true
  }, 
  
  "src": {
    files: [
      {
        expand: true, 
        cwd: 'src/html/', 
        src: [
          '**/*.*'
        ], 
        dest: "dist/html/"
      }
    ]
  }
}