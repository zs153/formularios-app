'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    clean: {
      src: ['dist']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      js: {
        files: {
          // config
          'dist/config/settings.js':                    ['dist/config/settings.js'],
          // controllers
          'dist/controllers/ade.controller.js':         ['dist/controllers/ade.controller.js'],
          'dist/controllers/carga.controller.js':       ['dist/controllers/carga.controller.js'],
          'dist/controllers/estadistica.controller.js': ['dist/controllers/estadistica.controller.js'],
          'dist/controllers/formulario.controller.js':  ['dist/controllers/formulario.controller.js'],
          'dist/controllers/historico.controller.js':   ['dist/controllers/historico.controller.js'],
          'dist/controllers/oficina.controller.js':     ['dist/controllers/oficina.controller.js'],
          'dist/controllers/tipo.controller.js':        ['dist/controllers/tipo.controller.js'],
          'dist/controllers/usuario.controller.js':     ['dist/controllers/usuario.controller.js'],
          // models
          'dist/models/ade.model.js':                   ['dist/models/ade.model.js'],
          'dist/models/carga.model.js':                 ['dist/models/carga.model.js'],
          'dist/models/estadistica.model.js':           ['dist/models/estadistica.model.js'],
          'dist/models/formulario.model.js':            ['dist/models/formulario.model.js'],
          'dist/models/historico.model.js':             ['dist/models/historico.model.js'],
          'dist/models/oficina.model.js':               ['dist/models/oficina.model.js'],
          'dist/models/tipo.model.js':                  ['dist/models/tipo.model.js'],
          'dist/models/usuario.model.js':               ['dist/models/usuario.model.js'],
          // routes
          'dist/routes/ade.router.js':                  ['dist/routes/ade.router.js'],
          'dist/routes/carga.router.js':                ['dist/routes/carga.router.js'],
          'dist/routes/estadistica.router.js':          ['dist/routes/estadistica.router.js'],
          'dist/routes/formulario.router.js':           ['dist/routes/formulario.router.js'],
          'dist/routes/historico.router.js':            ['dist/routes/historico.router.js'],
          'dist/routes/oficina.router.js':              ['dist/routes/oficina.router.js'],
          'dist/routes/tipo.router.js':                 ['dist/routes/tipo.router.js'],
          'dist/routes/usuario.router.js':              ['dist/routes/usuario.router.js'],
          // services
          'dist/services/database.js':                  ['dist/services/database.js'],
          'dist/services/web-server.js':                ['dist/services/web-server.js'],
          // indice
          'dist/index.js':                              ['dist/index.js'],
        }
        // src: ['./dist/models/usuario.model.js'],
        // dest: './dist/models/usuario.model.js'
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('concat-js', ['concat:js']);
  grunt.registerTask('default-js', ['uglify:js']);
  grunt.registerTask('default-css', ['concat:css', 'uglify:css']);
  grunt.registerTask('concat-css', ['concat:css']);
}