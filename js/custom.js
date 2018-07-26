 
 /**  
  * WpF BGness 
  * Template Scripts
  * Created by WpFreeware Team
  *Author Uri : http://www.wpfreeware.com/

  Custom JS
  
  1. Dropdown Menu
  2. Superslides Slider
  3. Slick Slider
  4. Google Map
  5. ScrollTop
  6. Wow animation
  7. Preloader   
  
**/

 jQuery(function($){

  /* ----------------------------------------------------------- */
  /*  1. Dropdown Menu
  /* ----------------------------------------------------------- */

   // for hover dropdown menu
  $('ul.nav li.dropdown').hover(function() {
      $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
    }, function() {
      $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
    });

  /* ----------------------------------------------------------- */
  /*  2. Superslides Slider
  /* ----------------------------------------------------------- */

   $('#slides').superslides({
      animation: 'fade'
    });
  
  /* ----------------------------------------------------------- */
  /*  3. Slick Slider
  /* ----------------------------------------------------------- */
  // For Works slider

  $('.slick_slider').slick({
    dots: true,
    infinite: true,      
    speed: 800,
    arrows:false,      
    slidesToShow: 1,
    slide: 'div',
    autoplay: true,
    fade: true,
    autoplaySpeed: 5000,
    cssEase: 'linear'
  }); 

// team slider call

$('.team_nav').slick({
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  arrows:false,  
  slidesToScroll: 4,
  slide: 'li',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

//Clients Slider Call

  $('.clb_nav').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  slide: 'li',
  dots: false,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,        
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

/* ----------------------------------------------------------- */
/*  4. Google Map
/* ----------------------------------------------------------- */

var zoom= $('#map_canvas').gmap('option', 'zoom');
  
$('#map_canvas').gmap().bind('init', function(ev, map) {
  $('#map_canvas').gmap('addMarker', {'position': '57.7973433,12.0502107', 'bounds': true});
  $('#map_canvas').gmap('option', 'zoom', 13);
});


});

/* ----------------------------------------------------------- */
/*  5. ScrollTop
/* ----------------------------------------------------------- */

//Check to see if the window is top if not then display button

$(window).scroll(function(){
  if ($(this).scrollTop() > 300) {
    $('.scrollToTop').fadeIn();
  } else {
    $('.scrollToTop').fadeOut();
  }
});
 
//Click event to scroll to top

$('.scrollToTop').click(function(){
  $('html, body').animate({scrollTop : 0},800);
  return false;
});


/* ----------------------------------------------------------- */
/*  6. WOW animation
/* ----------------------------------------------------------- */
wow = new WOW(
  {
    animateClass: 'animated',
    offset:       100
  }
);
wow.init();
// document.getElementById('moar').onclick = function() {
//   var section = document.createElement('section');
//   section.className = 'section--purple wow fadeInDown';
//   this.parentNode.insertBefore(section, this);
// };


/* ----------------------------------------------------------- */
/*  7. Preloader
/* ----------------------------------------------------------- */

//<![CDATA[
  jQuery(window).load(function() { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(100).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(100).css({'overflow':'visible'});
  })
//]]>



