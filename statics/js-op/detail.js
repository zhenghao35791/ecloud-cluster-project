/* 左侧导航伸缩*/

function moveBox(){
	/*右边滑入滑出*/
	      $('#boxclose').click(function () {
	          	$('#movebox').animate({'left':'2000px'}, 300);
	            $('#movebox').removeClass('visible').addClass('invisible');
	            $('table').find('td.selected').removeClass('selected');
	        });

	        $('.activator').click(function () {
	          var _this = $(this);
	           $('#movebox').addClass('visible')
	          if(_this.parent().hasClass('selected')){
	                /*当前行再次点击box消失*/
	             _this.parent().removeClass("selected");
	             _this.parent().siblings().removeClass('selected');
	             $("#boxclose").click();
	          }else{
	            /*消除兄弟行的的选中状态*/
	            _this.parents("tr").siblings().children('td').removeClass('selected');
	               /*当前行选中增加状态*/
	          _this.parent().addClass("selected");
	          _this.parent().siblings().addClass('selected');
	            $('#movebox').animate({'left':$(".status").offset().left+18-200}, 100);
	            $('#movebox').removeClass('invisible').addClass('visible');

	           /* 选中时box需要在这里刷新数据*/

	          }
	         
	         })
}
/*控制界面左右高度*/
$(function(){
}) 

