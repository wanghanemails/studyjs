/**
 * Created by wanghan1 on 2017/5/6.
 */

(function($){

           Game.prototype = {

                initLoadIng:function(e){



                    $("body").bind("touchmove",function(e){

                            var e= e||event

                            e.stopPropagation();
                            //禁止浏览器事件
                            e.preventDefault();

                            //尝试禁止浏览器 前进返回操作。。。
                            var control = navigator.control || {};
                            if (control.gesture) {
                                control.gesture(false);
                            }

                    });


                    var that = this;
                    //禁止时间冒泡


                    var start_X = 0;
                    var client_X = 0;
                    var moveClient_X = 0;
                    var current_loading_num = 0;

                    var time_task = setInterval(function(){

                       if(parseInt( $("."+that.loading_num).html())!==100){

                           $("."+that.loading_num).html(current_loading_num);
                           current_loading_num = parseInt( $("."+that.loading_num).html())+1;




                       }else{
                           clearInterval(time_task);

                           $(".loading").css("display","none")


                           $(".game-container").bind("touchstart",function(e){

                               start_X = e.originalEvent.targetTouches[0].pageX-this.offsetLeft;
                               client_X = e.originalEvent.targetTouches[0].pageX;



                           });

                           $(".game-container").bind("touchmove",function(e){


                                var current_X = e.originalEvent.targetTouches[0].pageX;
                               moveClient_X = e.originalEvent.targetTouches[0].pageX;

                               //边界判断    左边界   到达边界还想移动     未到边界  移动距离后超出边界
                               if((this.offsetLeft==0&&moveClient_X - client_X>0)||current_X - start_X>0){
                                   $(".game-container").css("left",0+"px")

                               }
                               //边界判断    右边界  到达边界还想移动     未到边界  移动距离后超出边界
                               else if((this.offsetLeft==-window.innerWidth &&  moveClient_X - client_X<0)||current_X - start_X<-375){
                                   $(".game-container").css("left",-window.innerWidth+"px")

                               }

                               else{
                                   $(".game-container").css("left",current_X - start_X)
                               }

                           });
                       }



                    },5)




                }








           }

            Game.prototype.constructor = Game;


            function Game(loading_num){
                this.loading_num = loading_num;
                this.initLoadIng();
            }

          function loading_bg(){

                var img1 = new Image();
                var img2 = new Image();

                img1.src = "images/loading-bg.png"
                img2.src = "images/loading-time-img.png"

                img1.onload = function(){
                    var game  = new  Game("loading-num-percentage");
                };

          }

             loading_bg();

            window.addEventListener("popstate",function(e){

            },false);

    //jQuery(document).ready(function ($) {
    //    if (window.history && window.history.pushState) {
    //        $(window).on('popstate', function () {
    //            window.history.forward(1);
    //        });
    //    }
    //});



})(jQuery)