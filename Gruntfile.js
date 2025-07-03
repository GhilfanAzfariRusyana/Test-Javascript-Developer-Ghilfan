module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: '.',
                    livereload: true,
                    open: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['index.html', 'app/**/*.js', 'app/views/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('serve', ['connect', 'watch']);
};
