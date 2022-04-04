/// <binding ProjectOpened='watch, code' />
module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: ['wwwroot/js/combinedCompiled.js'],
            options: {
                'esversion': 6,
                '-W069': false,
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            all: {
                files: {
                    'wwwroot/lib/combined.min.js': ['wwwroot/js/combinedCompiled.js']
                }
            }

        },
        watch: {

            allWatch: {
                files: ["TypeScript/**/**/*.ts", "TypeScript/**/*.ts"],
                tasks: ["all"]

            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("all", ['jshint', 'uglify:all']);

};