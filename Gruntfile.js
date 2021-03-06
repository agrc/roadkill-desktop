var osx = 'OS X 10.10';
var windows = 'Windows 8.1';
var browsers = [{
    // OSX
    browserName: 'safari',
    platform: osx
}, {
    // Windows
    browserName: 'firefox',
    platform: windows
}, {
    browserName: 'chrome',
    platform: windows
}, {
    browserName: 'microsoftedge',
    platform: 'Windows 10'
}, {
    browserName: 'internet explorer',
    platform: windows,
    version: '11'
}, {
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
}];
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var jsFiles = ['src/app/**/*.js', 'src/esrx/*.js', 'src/ext/*.js'];
    var otherFiles = [
        'src/app/**/*.html',
        'src/app/**/*.css',
        'src/css/**/*.css',
        'src/*.php',
        'src/common_html/**/*.php'
    ];
    var bumpFiles = [
        'package.json',
        'bower.json',
        'src/app/package.json',
        'src/app/config.js'
    ];
    var internFile = 'tests/intern.js';
    var packageFile = 'package.json';
    var eslintFiles = jsFiles.concat([internFile, packageFile]);
    var deployFiles = [
        '**',
        '!**/*.uncompressed.js',
        '!**/*consoleStripped.js',
        '!**/bootstrap/less/**',
        '!**/bootstrap/test-infra/**',
        '!**/tests/**',
        '!build-report.txt',
        '!components-jasmine/**',
        '!favico.js/**',
        '!jasmine-favicon-reporter/**',
        '!jasmine-jsreporter/**',
        '!stubmodule/**',
        '!util/**'
    ];
    var deployDir = 'wwwroot/wvc/desktop';
    var sauceConfig = {
        urls: ['http://127.0.0.1:8000/_SpecRunner.html?catch=false'],
        tunnelTimeout: 120,
        build: process.env.TRAVIS_JOB_ID,
        browsers: browsers,
        testname: 'roadkill-desktop',
        maxRetries: 10,
        maxPollRetries: 10,
        'public': 'public',
        throttled: 5,
        sauceConfig: {
            'max-duration': 1800
        },
        statusCheckAttempts: 500
    };
    var secrets;
    try {
        secrets = grunt.file.readJSON('secrets.json');
        sauceConfig.username = secrets.sauce_name;
        sauceConfig.key = secrets.sauce_key;
    } catch (e) {
        // swallow for build server
        secrets = {
            stageHost: '',
            prodHost: '',
            username: '',
            password: ''
        };
    }

    // Project configuration.
    grunt.initConfig({
        bump: {
            options: {
                files: bumpFiles,
                commitFiles: bumpFiles.concat('src/release_notes.php'),
                push: false
            }
        },
        clean: {
            build: ['dist'],
            deploy: ['deploy']
        },
        connect: {
            uses_defaults: {}
        },
        compress: {
            main: {
                options: {
                    archive: 'deploy/deploy.zip'
                },
                files: [{
                    src: deployFiles,
                    // dest: './',
                    cwd: 'dist/',
                    expand: true
                }]
            }
        },
        dojo: {
            prod: {
                options: {
                    profiles: ['profiles/prod.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            stage: {
                options: {
                    profiles: ['profiles/stage.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            options: {
                dojo: 'src/dojo/dojo.js', // Path to dojo.js file in dojo source
                load: 'build', // Optional: Utility to bootstrap (Default: 'build')
                releaseDir: '../dist',
                requires: ['src/app/run.js', 'src/app/packages.js'], // Optional: Module to require for the build (Default: nothing)
                basePath: './src'
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    // exclude tests because some images in dojox throw errors
                    src: ['**/*.{png,jpg,gif}', '!**/tests/**/*.*'],
                    dest: 'src/'
                }]
            }
        },
        jasmine: {
            main: {
                options: {
                    specs: ['src/app/**/Spec*.js'],
                    vendor: [
                        'src/jasmine-favicon-reporter/vendor/favico.js',
                        'src/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        'src/jasmine-jsreporter/jasmine-jsreporter.js',
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js',
                        'src/app/packages.js',
                        'src/app/tests/jsReporterSanitizer.js',
                        'src/app/tests/jasmineAMDErrorChecking.js',
                        'src/jquery/dist/jquery.js',
                        'src/bootstrap/dist/js/bootstrap.js'
                    ],
                    host: 'http://localhost:8000'
                }
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            main: {
                src: jsFiles
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        'saucelabs-jasmine': {
            all: {
                options: sauceConfig
            }
        },
        secrets: secrets,
        sftp: {
            stage: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.stageHost %>'
                }
            },
            prod: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.prodHost %>'
                }
            },
            options: {
                path: './' + deployDir + '/',
                srcBasePath: 'deploy/',
                username: '<%= secrets.username %>',
                password: '<%= secrets.password %>',
                showProgress: true
            }
        },
        sshexec: {
            options: {
                username: '<%= secrets.username %>',
                password: '<%= secrets.password %>'
            },
            stage: {
                command: ['cd ' + deployDir, 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.stageHost %>'
                }
            },
            prod: {
                command: ['cd ' + deployDir, 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.prodHost %>'
                }
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                sourceMap: true,
                compress: {
                    drop_console: true,
                    passes: 2,
                    dead_code: true
                }
            },
            stage: {
                options: {
                    compress: {
                        drop_console: false
                    }
                },
                src: ['dist/dojo/dojo.js'],
                dest: 'dist/dojo/dojo.js'
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**/*.js', '!proj4/**/*.js'],
                    dest: 'dist'
                }]
            }
        },
        watch: {
            eslint: {
                files: eslintFiles,
                tasks: ['newer:eslint:main', 'jasmine:main:build']
            },
            src: {
                files: eslintFiles.concat(otherFiles),
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', ['eslint', 'jasmine:main:build', 'connect', 'watch']);

    grunt.registerTask('build-prod', [
        'clean:build',
        'newer:imagemin:main',
        'dojo:prod',
        'uglify:prod'
    ]);
    grunt.registerTask('build-stage', [
        'clean:build',
        'newer:imagemin:main',
        'dojo:stage',
        'uglify:stage'
    ]);
    grunt.registerTask('deploy-prod', [
        'clean:deploy',
        'compress:main',
        'sftp:prod',
        'sshexec:prod'
    ]);
    grunt.registerTask('deploy-stage', [
        'clean:deploy',
        'compress:main',
        'sftp:stage',
        'sshexec:stage'
    ]);
    grunt.registerTask('sauce', [
        'jasmine:main:build',
        'connect',
        'saucelabs-jasmine'
    ]);
    grunt.registerTask('travis', [
        'eslint',
        'sauce',
        'build-prod'
    ]);
};
