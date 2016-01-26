var gulp = require('gulp'),
  browserSync = require('browser-sync');

gulp.task('browser-sync', function() {

  browserSync({ 

    // You can use wildcards in here.

    files: 'index.html, scripts/*.js, stylesheets/*.css',

    // We can pick port 8081 or 8082, if you are more of a 2's kind of guy, go for the 8082. Highly recommended.

    port: 8082
  

  });
});
