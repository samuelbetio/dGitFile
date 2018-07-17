$('button#start').click(function() {
	var results = $('p#results').html("Animating..."),
	button = $(this).attr('disabled', 'disabled');
	
	// CSS3 Container
	$('.target-css').animate({left: "+=200px", width:320 }, 1500, function() {
		results.html('first callback() fired, reversing...');
		$(this).animate({left: "-=200px", width:280 }, 1500, function() {
			results.html("second callback() fired");
			button.removeAttr('disabled');
		});
	});
	
	// CSS3 Container (leaveTransforms)
	$('.target-css-leave').animate({left: "+=200px", width:320, leaveTransforms:true }, 1500, function() {
		$(this).animate({left: "-=200px", width:280, leaveTransforms:true }, 1500);
		
	});
	
	// DOM container
	$('.target-dom').animate({left: "+=200px", width:320, avoidTransforms:true }, 1500, function() {
		$(this).animate({left: "-=200px", width:280, avoidTransforms:true }, 1500);
	});
});
