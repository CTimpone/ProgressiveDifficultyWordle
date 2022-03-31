/// <binding ProjectOpened='watch' />
module.exports = function (grunt) {
    grunt.initConfig({
        //clean: ["wwwroot/lib/*", "temp/"],
        clean: {
            complete: {
                src: ["wwwroot/lib/*", "temp/"],
            },
            tempOnly: {
                src: ["temp/"],
            }
        },
        concat: {
            all: {
                src: ['wwwroot/js/*.js' ],
                dest: 'temp/combined.js'
            }
        },
        jshint: {
            files: ['temp/*.js'],
            options: {
                'esversion': 6,
                '-W069': false,
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    'wwwroot/lib/combined.min.js': ['temp/combined.js']
                }
            }
        },
        watch: {
            files: ["TypeScript/**/*.ts"],
            tasks: ["all"]
        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("all", ['clean:complete', 'concat', 'jshint', 'uglify', 'clean:tempOnly']);
};