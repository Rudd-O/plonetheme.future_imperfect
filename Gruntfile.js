module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // we could just concatenate everything, really
        // but we like to have it the complex way.
        // also, in this way we do not have to worry
        // about putting files in the correct order
        // (the dependency tree is walked by r.js)
        less: {
            dist: {
                options: {
                    paths: [],
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '++theme++future_imperfect/less/future_imperfect-compiled.css.map',
                    sourceMapFilename: 'src/plonetheme/future_imperfect/theme/less/future_imperfect-compiled.css.map',
                    modifyVars: {
                        "isPlone": "false"
                    }
                },
                files: {
                    'src/plonetheme/future_imperfect/theme/styles/main.css': 'src/plonetheme/future_imperfect/theme/less/main.less'
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/plonetheme/future_imperfect/theme/scripts/**/*.js'],
                tasks: ['jshint', 'uglify']
            },
            stylesheets: {
              files: ['src/plonetheme/future_imperfect/theme/**/*.css', 'src/plonetheme/future_imperfect/theme/**/*.less'],
              tasks: ['less']
            },
            // html:{
            //     files: ['src/plonetheme/future_imperfect/theme/index.html'],
            //     tasks: ['htmlmin']
            // },
        },
        browserSync: {
            html: {
                bsFiles: {
                    src : ['src/plonetheme/future_imperfect/theme/less/*.less']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    server: {
                        baseDir: "."
                    }
                }
            },
            plone: {
                bsFiles: {
                    src : ['src/plonetheme/future_imperfect/theme/less/*.less']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    proxy: "localhost:8080"
                }
            }
        },

        jshint: {
             options: {
                reporter: require('jshint-stylish'),
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },

             build: ['Gruntfile.js', 'src/plonetheme/future_imperfect/theme/scripts/**/*.js']
        },

        uglify: {
              options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
                mangle: false
              },
              build: {
                files: {
                  'dist/theme/scripts/main.js': [
                    'src/plonetheme/future_imperfect/theme/scripts/ie/*.js',
                    'src/plonetheme/future_imperfect/theme/scripts/skel.min.js',
                    'src/plonetheme/future_imperfect/theme/scripts/util.js',
                    'src/plonetheme/future_imperfect/theme/scripts/main.js'
                  ]
                }
            }
        },

        cssmin: {
              options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
              },
              build: {
                files: {
                  'dist/theme/styles/main.css': 'src/plonetheme/future_imperfect/theme/styles/main.css'
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/theme/index.html': 'src/plonetheme/future_imperfect/theme/index.html',
                }
            },
        },

        copy: {
          dist: {
            files: [
              {
                expand: true,
                flatten: true,
                src: ['src/plonetheme/future_imperfect/theme/*'],
                dest: 'dist/theme/', filter: 'isFile'
            },

              {
                expand: true,
                cwd: 'src/plonetheme/future_imperfect/theme/',
                src: ['images/**', 'views/**', 'template-overrides/**', 'fonts/**'],
                dest: 'dist/theme/'
            },
            ],
          },
        },

        // make a zipfile
        compress: {
          dist: {
            options: {
              archive: 'plonetheme.future_imperfect.zip'
            },
            files: [
              {
              expand: true,
              cwd: 'dist/',
              src: ['theme/**'],
              dest: '', filter: 'isFile'},
            ]
          }
        },

    });

    // grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('bsync', ["browserSync:html", "watch"]);
    grunt.registerTask('plone-bsync', ["browserSync:plone", "watch"]);
    grunt.registerTask('dist', ['copy', 'jshint', 'uglify', 'cssmin', 'less', 'compress']);
};
