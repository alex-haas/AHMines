module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['ahmines/scripts/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['ahmines/scripts/test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'ahmines/scripts/**/*.js', 'ahmines/scripts/test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          validthis: true,
          document: true
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          findNestedDependencies: true,
          baseUrl: "ahmines/scripts/app",
          optimize: 'none',
          mainConfigFile: "ahmines/scripts/app/mines.js",
          include: "mines",
          out: "dist/<%= pkg.name %>.js",
          onModuleBundleComplete: function (data) {
            var fs = require('fs'),
              amdclean = require('amdclean'),
              outputFile = data.path;

            fs.writeFileSync(outputFile, amdclean.clean({
              'filePath': outputFile
            }));
          }
        }
      },
      compileForProduction: {
        options: {
          findNestedDependencies: true,
          baseUrl: "ahmines/scripts/app",
          optimize: 'uglify2',
          mainConfigFile: "ahmines/scripts/app/mines.js",
          include: "mines",
          out: "dist/scripts/<%= pkg.name %>.min.js",
          onModuleBundleComplete: function (data) {
            var fs = require('fs'),
              amdclean = require('amdclean'),
              outputFile = data.path;

            fs.writeFileSync(outputFile, amdclean.clean({
              'filePath': outputFile
            }));
          }
        }
      }
    },
    processhtml: {
      build: {
        options: {
          process: true
        },
        files: {
          'dist/index.html' : ['ahmines/index.html']
        }
      }
    },
    serve: {
        options: {
            port: 9000,
            serve: {
              path: 'ahmines'
            }
        }
    },
    copy: {
      jslibs: {
        files: [
          {
            expand: true, 
            flatten: true,
            src: 'ahmines/scripts/libs/jquery*.js', 
            dest: 'dist/scripts/libs/'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'ahmines/images/*',
            dest: 'dist/images/'
          }
        ]
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/css/ahmines.css': 'ahmines/css/ahmines.scss',       // 'destination': 'source'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('old_default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['requirejs:compile','processhtml:build','sass:dist','copy','serve','watch']);
  grunt.registerTask('production', ['requirejs:compileForProduction','processhtml:build','sass:dist','copy']);
};


