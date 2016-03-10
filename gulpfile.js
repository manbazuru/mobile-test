var gulp = require("gulp");

var sass = require("gulp-sass"); // sassコンパイル
var autoprefixer = require("gulp-autoprefixer"); // ベンダープレフィックス自動付与
var uglify = require("gulp-uglify"); // javascriptファイルの自動ミニファイド
var plumber = require("gulp-plumber"); // コンパイルエラー時にコネクト解除しない
var notify  = require('gulp-notify'); // エラー時にデスクトップに通知
var browser = require("browser-sync"); // ブラウザー自動リロード
 var imagemin = require("gulp-imagemin"); //画像圧縮


 // サーバー設定
 gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./"
        }
    });
});

//HTML リロード自動更新
gulp.task('html',function(){
gulp.src('./*.html')  
    .pipe(plumber())
    .pipe(browser.reload({stream:true}));
});
 
 //sassコンパイル、ベンダープレフィックス自動付与
gulp.task("sass", function() {
    gulp.src("sass/*.scss")
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')  // デスクトップに通知を出す
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./css"))
        .pipe(browser.reload({stream:true}));
});

 // javascriptファイルの自動ミニファイド
 gulp.task("js", function() {
     gulp.src(["js/*.js","!js/min/**/*.js"])
         .pipe(plumber())
//         .pipe(uglify())
//         .pipe(gulp.dest("./js/min"))
         .pipe(browser.reload({stream:true}));
 });

// 画像圧縮
// gulp.task('img',function(){
// gulp.src('img/**/*.{jpg,png,gif}')  
//     .pipe(imagemin())
//     .pipe(gulp.dest("./imgmin/"));
// });

//デフォルトタスク
 gulp.task("default",['server'], function() {
     gulp.watch(["js/*.js","!js/min/**/*.js"],["js"]);
     gulp.watch("sass/*.scss",["sass"]);
     gulp.watch("./*.html",["html"]);
 //    gulp.watch("img/**/*.{jpg,png,gif}",["img"]);
 });

