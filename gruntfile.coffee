paths =
  dist:        'app'
  sass:        '.sass-cache'
  src:
    dir:       'src'
    scripts:   '<%= paths.src.dir %>/scripts'
    styles:    '<%= paths.src.dir %>/styles'
    views:     '<%= paths.src.dir %>/views'
  test:        'test'
  tmp:
    dir:       '.tmp'
    styles:    '<%= paths.tmp.dir %>/styles'
    scripts:   '<%= paths.tmp.dir %>/scripts'
    lib:       '<%= paths.tmp.dir %>/scripts/lib'
    views:     '<%= paths.tmp.dir %>/views'
  vendor:
    dir:       'bower_components'
    dev:       '<%= paths.vendor.dir %>/dev'
    scripts:   '<%= paths.vendor.dir %>/scripts'
    styles:    '<%= paths.vendor.dir %>/styles'


module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig

    # paths to be used throught the configuration
    paths: paths

    # Gets dependent components from bower
    # see bower.json file
    bower:
      install:
        options:
          cleanTargetDir: true
          copy: true
          layout: (type) ->
            require('path').join(type)
          targetDir: '<%= paths.vendor.dir %>'
      uninstall:
        options:
          cleanBowerDir: true
          copy: false
          install: false


    # Deletes dist and .temp directories
    # The paths.tmp.dir directory is used during the build process
    # The paths.dist.dir directory contains the artifacts of the build
    # These directories should be deleted before subsequent builds
    # These directories are not committed to source control
    clean:
      tmp : [
        '<%= paths.sass %>'
        '<%= paths.tmp.dir %>'
      ],
      working: [
        '<%= paths.sass %>'
        '<%= paths.tmp.dir %>'
        '<%= paths.dist %>'
      ]


    # Compile CoffeeScript (.coffee) files to JavaScript (.js)
    coffee:
      app:
        cwd:  '<%= paths.tmp.dir %>'
        src:  '**/*.coffee'
        dest: '<%= paths.tmp.dir %>'
        ext:  '.js'
        expand: true


    # Lints CoffeeScript files
    coffeelint:
      options:
        camel_case_classes:
          level: 'warn'
        duplicate_key:
          level: 'warn'
        indentation:
          level: 'warn'
        max_line_length:
          level: 'ignore'
        no_empty_param_list:
          level: 'warn'
        no_tabs:
          level: 'warn'
        no_trailing_semicolons:
          level: 'warn'
        no_trailing_whitespace:
          level: 'warn'
        no_unnecessary_fat_arrows:
          level: 'warn'
      dev: [
        '<%= paths.src.dir %>/**/*.coffee'
        '<%= paths.test %>/**/*.coffee'
      ]
      prod:
        '<%= paths.src.dir %>/**/*.coffee'


    # Copies directories and files from one location to another
    copy:
      app:
        files: [
          cwd: '<%= paths.src.dir %>'
          src: '**'
          dest: '<%= paths.tmp.dir %>'
          expand: true
        ,
          cwd: '<%= paths.vendor.scripts %>'
          src: '**'
          dest: '<%= paths.tmp.lib %>'
          expand: true
        ,
          cwd: '<%= paths.vendor.styles %>'
          src: '**'
          dest: '<%= paths.tmp.styles %>'
          expand: true
        ]
      dev:
        cwd: '<%= paths.tmp.dir %>'
        src: '**'
        dest: '<%= paths.dist %>'
        expand: true
      prod:
        files: [
          cwd: '<%= paths.tmp.dir %>'
          src: [
            '**/*.{eot,svg,ttf,woff}'
            '**/*.{gif,jpeg,jpg,png,svg,webp,ico}'
            '*.html'
            'scripts/scripts.min.*.js'
            'styles/styles.min.*.css'
          ],
          dest: '<%= paths.dist %>'
          expand: true
        ]


    # minifies CSS (styles.css)
    cssmin:
      prod:
        files:
          '<%= paths.tmp.styles %>/styles.min.css': '<%= paths.tmp.styles %>/styles.css'
        options:
          keepSpecialComments: 0


    # Renames files based on their hashed content
    # When the files contents change, the hash value changes
    # Used as a cache buster, ensuring browsers load the correct static resources
    #
    # glyphicons-halflings.png -> glyphicons-halflings.6c8829cc6f.png
    # scripts.min.js -> scripts.min.6c355e03ee.js
    hash:
      scripts: '<%= paths.tmp.scripts %>/scripts.min.js'
      styles:  '<%= paths.tmp.styles %>/styles.min.css'


    # Runs unit tests using karma
    karma:
      unit:
        options:
          autoWatch: false
          browsers: ['PhantomJS']
          captureTimeout: 5000
          colors: true
          files: [
            '<%= paths.vendor.scripts %>/angular.js'
            '<%= paths.vendor.scripts %>/angular-cookies.js'
            '<%= paths.vendor.scripts %>/angular-ui-router.js'
            '<%= paths.vendor.scripts %>/underscore.js'
            '<%= paths.vendor.dev %>/angular-mocks.js'
            '<%= paths.vendor.dev %>/jquery.min.js'
            '<%= paths.dist %>/scripts/**/*.js'
            '<%= paths.test %>/**/*.{coffee,js}'
            '<%= paths.dist %>/**/*.html'
          ]
          frameworks: [
            'jasmine'
          ]
          keepalive: false
          logLevel: 'INFO'
          ngHtml2JsPreprocessor:
            stripPrefix: 'app/'
            moduleName: 'templates'
          port: 9876
          preprocessors:
            '**/*.coffee': 'coffee'
            '**/*.html': 'ng-html2js'
          reporters: ['progress']
          runnerPort: 9001
          singleRun: true


    # Minifies index.html
    # Extra white space and comments will be removed
    # Content within <pre /> tags will be left unchanged
    # IE conditional comments will be left unchanged
    # Reduces file size by over 14%
    minifyHtml:
      prod:
        cwd: '<%= paths.tmp.dir %>'
        src: '**.html'
        dest: '<%= paths.tmp.dir %>'
        expand: true


    # Prevents AngularJS injections from breaking when minified
    ngmin:
      prod:
        expand: true
        cwd:  '<%= paths.tmp.scripts %>'
        src:  [
          '**/*.js'
          '!lib/**'
        ]
        dest: '<%= paths.tmp.scripts %>'


    # Creates a file to push views directly into the $templateCache
    # This will produce a file with the following content
    # This file is then included in the output automatically
    # AngularJS will use it instead of going to the file system for the views, saving requests
    # The view content is also minified.
    ngTemplateCache:
      views:
        files:
          '<%= paths.tmp.scripts %>/templates.js': '<%= paths.tmp.views %>/*.html'
        options:
          trim: '<%= paths.tmp.dir %>/'


    # RequireJS optimizer configuration for both scripts and styles
    # This configuration is only used in the 'prod' build
    # The optimizer will scan the main file, walk the dependency tree, and write the output in dependent sequence to a single file
    # Since RequireJS is not being used outside of the main file or for dependency resolution (this is handled by AngularJS), RequireJS is not needed for final output and is excluded
    # RequireJS is still used for the 'dev' build
    # The main file is used only to establish the proper loading sequence
    requirejs:
      scripts:
        options:
          findNestedDependencies: true
          logLevel: 0
          baseUrl: '<%= paths.tmp.scripts %>'
          mainConfigFile: "<%= paths.tmp.scripts %>/main.js"
          name: "main"
          out: '<%= paths.tmp.scripts %>/scripts.min.js'
          onBuildWrite: (moduleName, path, contents) ->
            shouldExcludeModule = ['main'].indexOf(moduleName) >= 0
            if shouldExcludeModule then '' else contents
          optimize: 'uglify2'
          skipModuleInsertion: true
          preserveLicenseComments: false
          uglify:
            no_mangle: false
          useStrict: true
          wrap:
            start: '(function(){\'use strict\';'
            end: '}).call(this);'


    # Compile SASS (.scss) files to CSS (.css)
    sass:
      app:
        files:
          '<%= paths.tmp.styles %>/styles.css': '<%= paths.tmp.styles %>/main.scss'


    # Creates main file for RequireJS
    shimmer:
      dev:
        cwd: '<%= paths.tmp.scripts %>'
        src: [
          '**/*.{coffee,js}'
        ]
        order: [
          'lib/angular.js'
          'NGAPP':
            'ngCookies':  'lib/angular-cookies.js'
            'ngResource': 'lib/angular-resource.js'
            'ui.router':  'lib/angular-ui-router.js'
        ]
        require: 'NGBOOTSTRAP'
      prod: '<%= shimmer.dev %>'


    # Compiles underscore expressions
    #
    # The example below demonstrates the use of the environment configuration setting
    # In 'prod' build the hashed file of the concatenated and minified scripts is referened
    # In environments other than 'prod' the individual files are used and loaded with RequireJS
    #
    # <% if (config.environment === 'prod') { %>
    # 	<script src="<%= config.getHashedFile('.temp/scripts/scripts.min.js', {trim: '.temp'}) %>"></script>
    # <% } else { %>
    # 	<script data-main="/scripts/main.js" src="/scripts/libs/require.js"></script>
    # <% } %>
    template:
      indexDev:
        files:
          '.tmp/index.html': '<%= paths.tmp.dir %>/index.html'
      index:
        files: '<%= template.indexDev.files %>'
        environment: 'prod'


    # Run tasks when monitored files change
    watch:
      basic:
        files: [
          '<%= paths.src.dir %>/images/**'
          '<%= paths.src.dir %>/views/*.html'
        ]
        tasks: [
          'copy:app'
          'copy:dev'
        ]
        options:
          livereload: true
          nospawn: true
      coffee:
        files: '<%= paths.src.dir %>/**/*.coffee'
        tasks: [
          'clean:working'
          'coffeelint:dev',
          'copy:app'
          'shimmer:dev'
          'coffee'
          'copy:dev'
          'karma'
        ]
        options:
          livereload: true
          nospawn: true
      sass:
        files: '<%= paths.src.styles %>/*.scss'
        tasks: [
          'copy:app'
          'sass'
          'copy:dev'
        ]
        options:
          livereload: true
          nospawn: true
      index:
        files: '<%= paths.src.dir %>/index.html'
        tasks: [
          'copy:app'
          'template:indexDev'
          'copy:dev'
        ]
        options:
          livereload: true
          nospawn: true
      test:
        files: '<%= paths.test %>/**/*.coffee'
        tasks: [
          'coffeelint:dev'
          'karma'
        ]
        options:
          nospawn: true
      # Used to keep the web server alive
      none:
        files: 'none'
        options:
          livereload: true


  # ensure only tasks are executed for the changed coffee / scss file
  # without this, the tasks for all files matching the original pattern are executed
  grunt.event.on 'watch', (action, filepath, key) ->

    if key is 'test'

      grunt.config 'coffeelint.dev', filepath

    else
      path     = require 'path'
      file     = filepath.replace("#{paths.src.dir}/", "")
      dirname  = path.dirname file
      filename = path.basename file, path.extname file
      src      = file

      grunt.config 'copy.app',
        cwd: paths.src.dir
        src: file
        dest: paths.tmp.dir
        expand: true

      if key is 'coffee'
        # delete associated temp file prior to performing remaining tasks
        # without doing so, shimmer may fail
        grunt.config 'clean.working', path.join(paths.tmp.dir, dirname, "#{filename}.{coffee,js}")
        grunt.config 'coffee.app.src', file
        grunt.config 'coffeelint.dev', filepath
        src = [
          path.join(dirname, "#{filename}.{coffee,js}")
          'scripts/main.{coffee,js,js.map}'
        ]
        grunt.config 'coffelint'

      if key is 'sass'
        src = [
          path.join(dirname, "#{filename}.{scss,css}")
          path.join(dirname, 'styles.css')
        ]
      grunt.config 'copy.dev.src', src


  # Compiles the app with non-optimized build settings
  # Places the build artifacts in the dist directory
  grunt.registerTask 'build', [
    'clean:working'
    'coffeelint:dev'
    'copy:app'
    'shimmer:dev'
    'coffee'
    'sass'
    'template:indexDev'
    'copy:dev'
  ]


  # Compiles the app with non-optimized build settings
  # Places the build artifacts in the paths.dist.dir directory
  # Opens the app in the default browser
  # Watches for file changes, and compiles and reloads the web browser upon change
  grunt.registerTask 'dev', [
    'build'
    'watch'
  ]


  # Installs bower dependencies
  # Compiles the app with optimized build settings
  # Places the build artifacts in the paths.dist.dir directory
  grunt.registerTask 'install', [
    'clean:working'
    'bower:install'
    'prod'
  ]


  # Compiles the app with optimized build settings
  # Places the build artifacts in the paths.dist.dir directory
  grunt.registerTask 'prod', [
    'clean:working'
    'coffeelint:prod'
    'copy:app'
    'ngTemplateCache'
    'shimmer:prod'
    'coffee'
    'ngmin'
    'sass'
    'cssmin'
    'requirejs'
    'hash'
    'template:index'
    'minifyHtml:prod'
    'copy:prod'
    'clean:tmp'
  ]


  # Alias for the dev task
  # Compiles the app with non-optimized build settings
  # Places the build artifacts in the paths.dist.dir directory
  # Opens the app in the default browser
  # Watches for file changes, and compiles and reloads the web browser upon change
  grunt.registerTask 'start', [
    'dev'
  ]


  # Compiles the app with non-optimized build settings
  # Places the build artifacts in the paths.dist.dist directory
  # Runs unit tests via karma
  grunt.registerTask 'test', [
    'build',
    'karma'
  ]