          $(window).on('scroll',function() {
            if($(window).scrollTop() >= $('.navbar').offset().top){
              $('.navbar-fixer').css('min-height',$('.navbar').innerHeight());
              $('.navbar').addClass('fixed-top');
              $('.navbar-fixer').show();
            }
            if($(window).scrollTop()<$(window).innerHeight()){
              $('.navbar-fixer').hide();
              $('.navbar-fixer').css('min-height','0px');
              $('.navbar').removeClass('fixed-top');
            }
          });
