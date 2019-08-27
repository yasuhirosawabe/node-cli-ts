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

const targetNodeVersion = '10.16.0';
const appName = '{{ name }}';

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
    bundle('windows-x64'), bundle('mac-x64'), bundle('linux-x64'))));