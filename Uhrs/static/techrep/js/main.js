
var count_done = 0;
$(window).on('scroll',function(){
  var oTop = $('#achievements').offset().top - window.innerHeight;
  if (count_done == 0 && $(window).scrollTop() > oTop) {
    $('.count').each(function() {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({countNum: $this.text()}).animate({
          countNum: countTo
        },
        {
          duration: 2000,
          easing: 'swing',
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
          }
        });
    });
    count_done = 1;
  }

});


// function main() {

// (function () {
//    'use strict';

//    /* ==============================================
//   	Testimonial Slider
//   	=============================================== */ 

//   	$('a.page-scroll').click(function() {
//         if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//           var target = $(this.hash);
//           target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//           if (target.length) {
//             $('html,body').animate({
//               scrollTop: target.offset().top - 40
//             }, 900);
//             return false;
//           }
//         }
//       });

//     /*====================================
//     Show Menu on Book
//     ======================================*/
//     $(window).bind('scroll', function() {
//         var navHeight = $(window).height() - 500;
//         if ($(window).scrollTop() > navHeight) {
//             $('.navbar-default').addClass('on');
//         } else {
//             $('.navbar-default').removeClass('on');
//         }
//     });

//     $('body').scrollspy({ 
//         target: '.navbar-default',
//         offset: 80
//     });

//   	====================================
//     Portfolio Isotope Filter
//     ======================================
//     $(window).load(function() {
//         var $container = $('.portfolio-items');
//         $container.isotope({
//             filter: '*',
//             animationOptions: {
//                 duration: 750,
//                 easing: 'linear',
//                 queue: false
//             }
//         });
//         $('.cat a').click(function() {
//             $('.cat .active').removeClass('active');
//             $(this).addClass('active');
//             var selector = $(this).attr('data-filter');
//             $container.isotope({
//                 filter: selector,
//                 animationOptions: {
//                     duration: 750,
//                     easing: 'linear',
//                     queue: false
//                 }
//             });
//             return false;
//         });

//     });

//   	/*====================================
//     CounterUp
//     ======================================*/	

// 	$(document).ready(function( $ ) {
// 		if($("span.count").length > 0){	
// 			$('span.count').counterUp({
// 					delay: 10, // the delay time in ms
// 			time: 1000 // the speed time in ms
// 			});
// 		}
// 	});
	
//   	/*====================================
//     Pretty Photo
//     ======================================*/
// 	$("a[rel^='prettyPhoto']").prettyPhoto({
// 		social_tools: false
// 	});	

// }());


// }
// main();