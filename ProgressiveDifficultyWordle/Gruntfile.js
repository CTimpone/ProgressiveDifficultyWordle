/// <binding AfterBuild='all' />
const webpackConfig = require('./webpack.config.js');


module.exports = function (grunt) {
    grunt.initConfig({
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
        cssmin: {
            target: {
                src: 'wwwroot/css/pdw.css',
                dest: 'wwwroot/lib/pdw.min.css'
            }
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

    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask("all", ['eslint', 'webpack', 'cssmin']);
};