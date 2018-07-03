$().ready(function() {
    $('video.avid').each(function () {
        if ($(this).data('url')) {
            $(this).attr('controlsList','nodownload').html('<source src="http://cdn.ahacdu.com' + $(this).data('url') + '.mp4"><source src="http://cdn.ahacdu.com' + $(this).data('url') + '.webm">');
        }
    });
});
