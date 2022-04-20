/// <binding AfterBuild='all' />
const webpackConfig = require('./webpack.config.js');

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
        webpack: {
            webpackConfig,
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask("all", ['clean:complete', 'eslint', 'webpack', 'clean:tempOnly']);

};