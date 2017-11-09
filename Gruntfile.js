module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // we could just concatenate everything, really
    // but we like to have it the complex way.
    // also, in this way we do not have to worry
    // about putting files in the correct order
    // (the dependency tree is walked by r.js)
    copy: {
      barceloneta_src: {
        files: [
          // includes files within path and its sub-directories
          {
            expand: true,
            cwd: 'node_modules/plonetheme.barceloneta/plonetheme/barceloneta/theme/less/',
            src: ['*.less'],
            dest: '_less/barceloneta/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/plonetheme.barceloneta/plonetheme/barceloneta/theme/less/roboto',
            src: ['**'],
            dest: 'assets/css/roboto',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/plonetheme.barceloneta/plonetheme/barceloneta/theme/',
            src: [
              '*.ico',
              '*.png'
            ],
            dest: 'assets/img',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/plonetheme.barceloneta/plonetheme/barceloneta/theme/',
            src: [
              'rules.xml'
            ],
            dest: 'rules/',
            filter: 'isFile',
            rename: function(dest, src) {
              return dest + src.replace('rules.xml','barceloneta.xml');
            }
          },
        ],
      },
    },

    less: {
      dev: {
        options: {
          compress: false,
          paths: [],
          strictMath: false,
          sourceMap: true,
          sourceMapFileInline: true
        },
        files: {
          'assets/css/barceloneta.css': '_less/barceloneta.less',
          'assets/css/theme.css': '_less/theme.less',
        }
      },
      dist: {
        options: {
          compress: true,
          paths: [],
          strictMath: false,
          sourceMap: false,
        },
        files: {
          'assets/css/barceloneta.css': '_less/barceloneta.less',
          'assets/css/theme.css': '_less/theme.less',
        }
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions']
          })
        ]
      },
      dev: {
        options: {
          map: true,
        },
        src: 'assets/css/*.css'
      },
      dist: {
        map: false,
        src: 'assets/css/*.css'
      }
    },
    watch: {
      less: {
        files: [
          '_less/*.less',
          '_less/**/*.less'
        ],
        tasks: ['less:dev', 'postcss:dev']
      }
    },
    browserSync: {
      html: {
        bsFiles: {
          src : [
            'assets/css/*.css',
            '*.html'
          ]
        },
        options: {
          watchTask: true,
          debugInfo: true,
          online: true,
          server: {
            baseDir: "."
          },
        }
      },
      plone: {
        bsFiles: {
          src : [
            'assets/css/*.css',
            'rules/*.xml',
            '*.html',
            '*.xml'
          ]
        },
        options: {
          watchTask: true,
          debugInfo: true,
          proxy: "localhost:8080",
          reloadDelay: 3000,
          // reloadDebounce: 2000,
          online: true
        }
      }
    }
  });


  // grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');

  // CWD to theme folder
  grunt.file.setBase('./src/plonetheme/barcelonetang/theme');

  grunt.registerTask('update', ['copy:barceloneta_src', 'release']);
  grunt.registerTask('release', ['less:dist', 'postcss:dist']);
  grunt.registerTask('compile', ['less:dev', 'postcss:dev']);
  grunt.registerTask('default', ['release']);
  grunt.registerTask('bsync', ['browserSync:html', 'watch']);
  grunt.registerTask('bsync-plone', ['browserSync:plone', 'watch']);
};
