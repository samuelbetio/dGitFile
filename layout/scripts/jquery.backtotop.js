/*
Template Name: Brickary
Author: <a href="https://samuelbetio.github.io/LDPage/">LIVE DEMO Pages</a>
Author URI: https://samuelbetio.github.io/LDPage/
Licence: Free to use under our free template licence terms
Licence URI: https://samuelbetio.github.io/LDPage/LICENSE
File: Back to Top JS
*/

jQuery("#backtotop").click(function () {
    jQuery("body,html").animate({
        scrollTop: 0
    }, 600);
});
jQuery(window).scroll(function () {
    if (jQuery(window).scrollTop() > 150) {
        jQuery("#backtotop").addClass("visible");
    } else {
        jQuery("#backtotop").removeClass("visible");
    }
});