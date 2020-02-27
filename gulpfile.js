// 1. Déclaration des variables

let gulp         = require('gulp');
let sass         = require('gulp-sass');
let rename       = require('gulp-rename');
let autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;

// 2. Mes tâches


gulp.task('sassification', function(){
    return gulp.src('./dev/css/*.scss')
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename(function (path) {
        path.basename += ".min";
    }))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest('prod/css'));
})
gulp.task('htmlification', function(){
    return gulp.src('./dev/index.html')
    .pipe(gulp.dest('prod/'));
})
gulp.task('browsersync', function() {
    browserSync.init({
        server: {
            baseDir: "prod/"
        }
        
    });
});
gulp.task('jsification', function () {
    return pipeline(
          gulp.src('dev/js/*.js'),
          uglify(),
          rename(function (path) {
            path.basename += ".min";
        }),
          gulp.dest('prod/js')
    );
  });


// 3. Execution des tâches
gulp.task('observe', gulp.parallel('browsersync','sassification', 'htmlification', 'jsification', function(){
    gulp.watch('./dev/css/**/*.scss', gulp.series('sassification'));
    gulp.watch('./dev/js/**/*.js', gulp.series('jsification'));
    gulp.watch('./dev/*.html', gulp.series('htmlification'));
    gulp.watch("./prod/**/*").on('change', browserSync.reload);
}))

gulp.task('default', gulp.series('observe'));
