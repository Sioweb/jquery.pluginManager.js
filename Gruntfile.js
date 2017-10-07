module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.js','!*.min.js'],
					dest: 'dist'
				}]
			}
		},
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['*.css','!*.min.css'],
					dest: 'dist'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', ['uglify','cssmin']);

};