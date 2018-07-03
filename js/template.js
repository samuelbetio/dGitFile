$(function () {

    if ($('header').css('content') == '"fixedMenu"') {
        $('main').css('padding-top', $('header').height() + parseInt($('header').css('padding-top')) + parseInt($('header').css('padding-bottom')) + 10)
    }

    if($('.sidebar').css('content') == '"scrollSideBar"') {
        console.log('true');
        var height = $('.sidebar').offset().top;
        var width = $('.sidebar').width();

        $(window).on('scroll', function (e) {
            if(window.pageYOffset >= height) {
                $('.sidebar').css({
                    'position': 'fixed',
                    'top': '0px',
                    'width': width,
                    'margin-left': '40px'
                });
                if ($('header').css('content') == '"fixedMenu"') {
                    $('.sidebar').css({
                        'top': $('header').height() + parseInt($('header').css('padding-top')) + parseInt($('header').css('padding-bottom')) + 10
                    })
                }
            }
            else if (window.pageYOffset >= $('.sidebar').offset().top) {
                $('.sidebar').css({
                    'position': 'relative',
                    'top': '0px',
                    'margin-left': '0'
                })
            }
            else {
                $('.sidebar').css({
                    'position': 'relative',
                    'top': '0px',
                    'margin-left': '0'
                })
            }
        })
    }
});
