module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                style: 'compressed'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'source/sass',
                    src: ['*.scss'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        concat: {
            css: {
                src: ['dist/css/*.css'],
                dest: 'dist/css/combined.css'
            },
            js: {
                src: ['public/js/*.js'],
                dest: 'dist/js/bundle.js'
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/js/bundle.min.js': ['public/js/*.js']
                }
            }
        },
        hashres: {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${name}.${hash}.${ext}',
                renameFiles: true
            },
            prod: {
                src: [
                    'dist/js/bundle.min.js',
                    'dist/css/combined.css'
                ],
                dest: [
                    'view/layout/*.pug'
                ],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-hashres');

    grunt.registerTask('default', ['sass', 'concat', 'uglify', 'hashres']);
};
