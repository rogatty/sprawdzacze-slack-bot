var gulp = require('gulp'),
	server = require('gulp-develop-server');

gulp.task('default', function () {
	server.listen({
		path: 'app.js'
	});

	gulp.watch([
		'app.js',
		'lib/**/*.js'
	]).on('change', function (event) {
		console.log('File changed: ' + event.path);
		console.log('Restarting server');
		server.restart();
	});
});

//if anything happens kill server
process.on('exit', function () {
	server.kill();
});
