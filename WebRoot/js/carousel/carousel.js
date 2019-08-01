/**
 * Created by asus on 2016/7/3.
 */
$(function () {

    //轮播自动播放
    $('#myCarousel').carousel({
        //自动4秒播放
        interval : 4000,
    });

    //设置垂直居中
    $('.carousel-control').css('line-height', $('.carousel-inner img').height() + 'px');
    $(window).resize(function () {
        var $height = $('.carousel-inner img').eq(0).height() ||
            $('.carousel-inner img').eq(1).height() ||
            $('.carousel-inner img').eq(2).height();
        $('.carousel-control').css('line-height', $height + 'px');
    });

});
