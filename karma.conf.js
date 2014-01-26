module.exports = function(config) {
    config.set({
        autoWatch: true,
        basePath: '',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: [
            'app/vendor/underscore/underscore.js',
            'app/vendor/jquery/jquery.js',
            'app/vendor/angular/angular.js',
            'app/vendor/angular-cookies/angular-cookies.js',
            'app/vendor/angular-mocks/angular-mocks.js',
            'app/vendor/angular-resource/angular-resource.js',
            'app/vendor/angular-ui-router/release/angular-ui-router.js',
            'app/js/*.js',
            'app/**/*.html',
            'test/**/*.js'
        ],
        logLevel: config.LOG_DEBUG,
        ngHtml2JsPreprocessor: {
            moduleName: 'templates'
        },
        preprocessors: {
            'app/**/*.html': 'ng-html2js'
        }
    })
}
