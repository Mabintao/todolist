var gulp = require('gulp');
/*var gulpminHtml= require("gulp-minify-html");  //压缩html
var gulpJSMin= require("gulp-concat");  //压缩html*/
var $ = require("gulp-load-plugins")();  //引进所有的包
var open=require("open")

//生成lib目录
gulp.task('lib',function(){
	gulp.src("bower_components/**/dist/*.js")
		.pipe(gulp.dest("build/lib"))
		.pipe(gulp.dest("dev/lib"))
		.pipe($.connect.reload());
})

//复制压缩html
gulp.task('html', function() {
	gulp.src("src/*.html") //读取文件
		.pipe(gulp.dest("build/"))  //复制到build开发目录
		.pipe($.minifyHtml())   //压缩
		.pipe(gulp.dest("dev")) //复制到生产环境
		.pipe($.connect.reload());
});

//复制压缩css
gulp.task('css', function() {
	gulp.src("src/css/*.css") //读取文件s
		.pipe(gulp.dest("build/css"))  //复制到build开发目录
		.pipe($.cssmin())   //压缩
		.pipe(gulp.dest("dev/css"))  //复制到生产环境
		.pipe($.connect.reload());
});

//合并压缩js
gulp.task('js', function() {
	gulp.src("src/js/*.js") //读取文件
		.pipe($.concat("index.js"))
		.pipe(gulp.dest("build/js"))  //复制到build开发目录
		.pipe($.uglify())   //压缩
		.pipe(gulp.dest("dev/js"))  //复制到生产环境
		.pipe($.connect.reload());
});

//压缩img
gulp.task("img",function(){
	gulp.src("src/images/*") //读取文件夹中所有的文件
		.pipe(gulp.dest("build/images"))	//复制到build开发目录
		.pipe($.imagemin())	//压缩
		.pipe(gulp.dest("dev/images"))  //复制到生产环境
		.pipe($.connect.reload());
});

//清除文件夹
gulp.task("clear",function(){
	gulp.src(["build/","dev/"])
		.pipe($.clean());
});

//总的任务
gulp.task("build",["html","js","img","css","lib"]);

//自动刷新，自动打开
gulp.task("server",function(){
    $.connect.server({
        root:"build/",
        port: 8000,
        livereload: true
    });

    open("http://localhost:8000");

    gulp.watch("src/*.html",["html"]);
    gulp.watch("src/css/*.css",["css"]);
    gulp.watch("src/js/*.js",["js"]);
    gulp.watch("src/images/*",["img"]);
});

//默认任务
gulp.task('default', ['server']);