
    $(document).ready(function () {
        var nav = $("#fxd");
        var h = nav.offset().top;
        var obj = $("#ftr");
        $(window).scroll(function () {
            if ($(window).scrollTop() > h) {
                obj.fadeIn();

            } else {
                obj.fadeOut();

            }
        });

    });
