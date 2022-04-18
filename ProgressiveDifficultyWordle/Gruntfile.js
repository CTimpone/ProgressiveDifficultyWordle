/// <binding ProjectOpened='watch, code' />
module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            complete: {
                src: ["wwwroot/lib/combined.min.js", "wwwroot/lib/words.min.js", "temp/"],
            },
            codeOnly: {
                src: ["wwwroot/lib/combined.min.js", "temp/"],
            },
            tempOnly: {
                src: ["temp/"],
            }
        },
        concat: {
            scripts: {
                src: ['wwwroot/js/GameLogic/*.js', 'wwwroot/js/Models/*.js'],
                dest: 'temp/combined.js'
            },
            words: {
                src: ['wwwroot/js/Constants/Words/*.js'],
                dest: 'temp/words.js'
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
            codeMin: {
                files: {
                    'wwwroot/lib/combined.min.js': ['temp/combined.js']
                }
            },
            wordsMin: {
                files: {
                    'wwwroot/lib/words.min.js': ['temp/words.js']
                }
            },

        },
        watch: {
            codeWatch: {
                files: ["TypeScript/**/*.ts"],
                tasks: ["code"]
            },
            allWatch: {
                files: ["TypeScript/**/**/*.ts"],
                tasks: ["all"]

            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("code", ['clean:codeOnly', 'concat:scripts', 'jshint', 'uglify:codeMin', 'clean:tempOnly']);
    grunt.registerTask("all", ['clean:complete', 'concat:scripts', 'concat:words', 'jshint', 'uglify:codeMin', 'uglify:wordsMin', 'clean:tempOnly']);

};