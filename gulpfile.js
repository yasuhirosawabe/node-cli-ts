const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject(
    'tsconfig.json', {
        typescript: require('typescript')
    }
);
const { compile } = require('nexe');

const appName = '{{ name }}';
const targetOss = ['mac-x64', 'linux-x64', 'alpine-x64', 'windows-x64'];
const targetNodeVersion = '10.16.0';

function bundle(targetOs) {
    return gulp.series(() => {
        return new Promise(resolve => {
            compile({
                input: './bin/index.js',
                target: `${targetOs}-${targetNodeVersion}`,
                output: `./dist/${appName}-${targetOs}`,
                resources: ['./bin/**/*.map']
            }).then(() => {
                resolve();
            });
        });
    });
}

gulp.task('compile', gulp.series(() => {
    return gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('bin'));
}));

gulp.task('clean', gulp.series(() => {
    return del(['bin', 'dist']);
}));

gulp.task('default', gulp.series('clean', 'compile', gulp.parallel(
    targetOss.map(tos => bundle(tos)))));