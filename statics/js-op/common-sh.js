   /*一级导航登录名下拉的退出显示*/
$(function() {
  var $oe_menu    = $('#oe_menu');
  var $oe_menu_items  = $oe_menu.children('li');
  var $oe_overlay   = $('#oe_overlay');
        
  $oe_menu_items.bind('mouseenter',function(){
    var $this = $(this);
    $this.addClass('slided selected');
    if($this.children('div')){
    $this.children('div').css('z-index','9999').stop(true,true).slideDown(200,function(){
      $oe_menu_items.not('.slided').children('div').hide();
      $this.removeClass('slided');
    });
  }}).bind('mouseleave',function(){
    var $this = $(this);
    $this.removeClass('selected').children('div').css('z-index','1');
  });

  $oe_menu.bind('mouseenter',function(){
    var $this = $(this);
    $oe_overlay.stop(true,true).fadeTo(200, 0.6);
    $this.addClass('hovered');
  }).bind('mouseleave',function(){
    var $this = $(this);
    $this.removeClass('hovered');
    $oe_overlay.stop(true,true).css("display","none");
    $oe_menu_items.children('div').hide();
  })
});
    /*顶部下拉菜单*/
jQuery(document).ready(function(){
  var qcloud={};
  $('[_t_nav]').hover(function(){
    var _nav = $(this).attr('_t_nav');
    clearTimeout( qcloud[ _nav + '_timer' ] );
    qcloud[ _nav + '_timer' ] = setTimeout(function(){
    $('#'+_nav).stop(true,true).slideDown(200);
    }, 150);
  },function(){
    var _nav = $(this).attr('_t_nav');
    clearTimeout( qcloud[ _nav + '_timer' ] );
    qcloud[ _nav + '_timer' ] = setTimeout(function(){
    $('#'+_nav).stop(true,true).slideUp(200);
    }, 150);
  });
});

/*总览页*/
$(function(){
 bodyheight();
    function bodyheight(){
      if(document.body.scrollHeight < $(window).innerHeight()){
        $(".control_view").height($(window).innerHeight());}else{
        $(".control_view").height(document.body.scrollHeight);
    }
    }
$(window).resize(function() {
  bodyheight();
});

    $('.source-item').each(function(){
        $(this).hover(function(){
  $(this).find('.rate').fadeIn(300)
},function(){
  $(this).find('.rate').fadeOut(300)
});
 });
     $('.source-piechart').each(function(){
        $(this).hover(function(){
  $(this).find('.pieRate').fadeIn(300)
},function(){
  $(this).find('.pieRate').fadeOut(300)
});
 });
 
})

$(".table tbody tr").hover(function(){
  $(this).css("background","#f4f5f6");
  $(this).siblings().css("background","#fff");
  $(this).parent().parent().find('thead tr').removeClass('thead');
},function(){
   $(this).css("background","#fff");
})

/*控制文字显示长度*/
 jQuery.fn.limit=function(){
var self = $("p[limit]");
self.each(function(){
var objString = $(this).text();
var all = objString;
var objLength = $(this).text().length;
var num = $(this).attr("limit");
if(objLength > num){
/*$(this).attr("title",objString);*/
objString = $(this).text(objString.substring(0,num) + "...");
$(this).parent().append("<i id='showMore' class='log_down'></i>");
}
$("#showMore").toggle(function(){
  $(this).parent().find("p").text(all);
  $(this).removeClass('log_down').addClass('log_up');
},function(){
  $(this).parent().find("p").text(all.substring(0,num) + "...");
  $(this).removeClass('log_up').addClass('log_down');
})
})
}
/*$(function(){
$(document.body).limit();
}) */

/*模拟下拉框*/
$(document).ready(function(){
downMenu(".select_input"); 
function downMenu(clickTarget){
	$(document).on("click", clickTarget,function(event){
    event = event ||window.event;
    event.stopPropagation();
   $(this).next(".select_ul").toggle();
   $(this).find(".select_dropdown").toggleClass('down-rotate');
   if($(this).parents("tr")){
     $(this).parents("tr").siblings().find(".select_ul").hide();
   }
  })
   $(clickTarget).next(".select_ul").find("a").click(function(){
        $(this).parent(".select_ul").hide();
        $(this).parent().prev().find(".select_dropdown").removeClass('down-rotate');
        $(this).parent().prev().find(".select_txt").html(($(this).html())); 
  });
   $(clickTarget).next(".select_ul").find("a").mouseover(function(){
         $(".select_ul a").removeClass("select_blue");
         $(this).addClass("select_blue");
  });
  $(document).click(function(){
     $(clickTarget).next(".select_ul").hide();
     $(".select_ul a").removeClass("select_blue");
     if($(clickTarget).find(".select_dropdown").hasClass('down-rotate'))
      {
       $(".select_dropdown").removeClass('down-rotate');
      }
  })
}
})
