var navEvents = document.getElementById('events-submenu');
var navComp = document.getElementById('competitions-submenu');
var navWorkshop = document.getElementById('workshops-submenu');


function initialize(){
    
var a = 0;
$(window).scroll(function() {

    

  var oTop = $('#counter').offset().top - window.innerHeight;
  if (a == 0 && $(window).scrollTop() > oTop) {
    $('.counter-value').each(function() {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({
        countNum: $this.text()
      }).animate({
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
            //alert('finished');
          }

        });
    });
    a = 1;
  }

});
    
    
$(window).scroll(function() {
  $(".slideanim").each(function(){
    var pos = $(this).offset().top;

    var winTop = $(window).scrollTop();
    if (pos < winTop + 600) {
      $(this).addClass("slide");
    }
  });
}); 
    
    
    

    
}
                 
                 
                 










function events(){
    

    navEvents.style.height = "250px";
    navComp.style.height = "0"
    navWorkshop.style.height = "0";
}

function competitions(){
    
    navComp.style.height = "200px";
    navEvents.style.height = "0";
    navWorkshop.style.height = "0";
}





