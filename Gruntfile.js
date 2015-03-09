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
          baseUrl: "ahmines/scripts/app",
          mainConfigFile: "ahmines/scripts/app/mines.js",
          include: "mines",
          name: "../libs/almond",
          out: "dist/<%= pkg.name %>.js"
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

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('old_default', ['jshint', 'qunit', 'concat', 'uglify']);

  grunt.registerTask('default', ['requirejs']);
};


