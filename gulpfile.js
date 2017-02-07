var $r = require,
    $gulp = $r('gulp'),
    $jade = $r('gulp-jade'),
    $scss = $r('gulp-sass'),
    $smap = $r('gulp-sourcemaps'),
    $cmin = $r('gulp-minify-css'),
    $imin = $r('gulp-imagemin'),
    $spriter = $r('gulp.spritesmith'),
    $repl = $r('gulp-replace'),
    $renm = $r('gulp-rename'),
    $cache = $r('gulp-cache'),
    $jshint = $r('gulp-jshint'),
    $htmlBeautify = $r('gulp-html-beautify'),
    $htmlMin = $r('gulp-htmlmin');

//- scss=>css
$gulp.task('css', ['sprite'], function () {//雪碧图合并后才执行css编译与合并
    return $gulp.src('share/scss/@Novel.scss')
        .pipe($smap.init())
        .pipe($scss().on('error', $scss.logError))
        .pipe($cmin())
        .pipe($repl('/*!', '/*'))
        .pipe($renm('novel.min.css'))
        .pipe($smap.write('.'))
        .pipe($gulp.dest('var/build'));
});

//- jade=>html
$gulp.task('html', function () {
    return $gulp.src([
        'share/jade/**/*.jade',
        '!share/jade/**/_*.jade',
        '!share/jade/**/@*.jade'
    ])
    .pipe($jade({
        // pretty: '\t'
    }))
    .pipe($htmlBeautify({
        indent_size: 4,
        indent_char: ' ',
        // 这里是关键，可以让一个标签独占一行
        unformatted: true,
        // 默认情况下，body | head 标签前会有一行空格
        extra_liners: []
    }))
    .pipe($htmlMin({

    }))
    .pipe($gulp.dest('var/build'));
});

//- jade=>html
$gulp.task('cacheHtml', function () {
    return $gulp.src([
        'share/jade/**/*.jade',
        '!share/jade/**/_*.jade',
        '!share/jade/**/@*.jade'
    ])
    .pipe($cache($jade({
        pretty: '\t'
    })))
    .pipe($htmlBeautify({
        indent_size: 4,
        indent_char: ' ',
        // 这里是关键，可以让一个标签独占一行
        unformatted: true,
        // 默认情况下，body | head 标签前会有一行空格
        extra_liners: []
    }))
    .pipe($htmlMin({

    }))
    .pipe($gulp.dest('var/build'));
});

//- 图片压缩
$gulp.task('imagemin', ['sprite'], function () {//雪碧图合并后才执行图片压缩
    $gulp.src([
            'var/img/**/*.{png,jpg,gif,ico}',
            'share/img/**/*.{png,jpg,gif,ico}'
        ])
        .pipe($cache(
                $imin({
                    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
                })
            ))
        .pipe($gulp.dest('./var/img'));
});

//- 图片合并
$gulp.task('sprite', function() {
    var spriteData = $gulp.src('share/demo/@sprite/**/*.{png,jpg,gif,ico}').pipe($spriter({
        imgName: 'share/img/@sprite/**/sprite.png',
        cssName: 'share/scss/@sprite-icons.scss',
        cssFormat: 'scss'
    }));
    return spriteData.pipe($gulp.dest('./'));
});

//- 监听事件集合
$gulp.task('watch', ['sprite', 'imagemin', 'css', 'html'], function() {//其他任务执行完毕后才执行监听事件
    //- 监听jade变化
    $gulp.watch(['share/jade/**/*.jade', '!share/jade/**/_*.jade','!share/jade/**/@*.jade'], ['cacheHtml']);//页面jade变化使用缓存

    $gulp.watch(['share/jade/**/_*.jade'], ['html']);//组件jade变化编译所有文件

    //- 监听scss变化
    $gulp.watch(['share/scss/**/*.scss'], ['css']);

    $gulp.watch(['share/demo/@sprite/*.{png,jpg,gif,ico}'], ['sprite']);

    //- 检测js错误
    $gulp.src('var/js/*.js')
        .pipe($jshint())
        .pipe($jshint.reporter('default'));
});

//- 默认事件集合
$gulp.task('default', ['sprite', 'imagemin', 'css', 'html', 'watch']);
