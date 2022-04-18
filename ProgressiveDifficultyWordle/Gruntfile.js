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
        eslint: {
            options: {
                overrideConfigFile: 'eslint.json',
            },
            target: [
                "TypeScript/**/*.ts",
                "TypeScript/**/**/*.ts"
            ]
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
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("code", ['clean:codeOnly', 'concat:scripts', 'eslint', 'uglify:codeMin', 'clean:tempOnly']);
    grunt.registerTask("all", ['clean:complete', 'concat:scripts', 'concat:words', 'eslint', 'uglify:codeMin', 'uglify:wordsMin', 'clean:tempOnly']);

};