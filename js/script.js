$(window).ready(function () {
    $('.testimonials').flexslider({
        animation: "slide",
        controlNav: false,
        directionNav: true,
        animationLoop: true,
        itemWidth: 420,
        itemMargin: 0
    });
    $('.mainslider').flexslider({
        slideshow: true,
        controlNav: false,
        nextText: "<i class='icon-chevron-right'></i>",
        prevText: "<i class='icon-chevron-left'></i>"
    });
    $('#thumbs a').touchTouch();
});