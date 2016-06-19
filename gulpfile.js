var gulp = require("gulp");
var livereload = require('gulp-livereload');

//Directory configuration

var directories = ["./*.html", "js/controllers/*.js", "js/*.js", "styling/*.css", "./*.html", "js/**/*.js"];

gulp.task('default', [], function() {
	livereload.listen();
	gulp.watch(directories, function(){
		gulp.src(directories).pipe(livereload());
	});
});
