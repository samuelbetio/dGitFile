$(function() {
    $('.js_submit_simple').on('touchend, click', function(e) {
        e.preventDefault();
        $('.corb-pl').show();
        return false;
    });
 
    $('.corb-pl > form').on('touchend, click', function(e) {
        e.stopPropagation();
        return true;
    });
 
    $('.corb-pl').on('touchend, click', function() {
        $(this).hide();
    });
});
