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

                    $(".simulation-train-move").width($(".train").width());
                    $(".simulation-train-move").height($(".train").height());

                    that.game_container_start_X = 0;
                    that.game_container_client_X = 0;
                    that.moveClient_X = 0;
                    var current_loading_num = 0;
                    $(".section-bg").width(that.container_width);
                    $(".top-container").width(2*that.container_width);
                    //线上环境
                    //var time_task = setInterval(function(){
                    //
                    //    if(parseInt( $("."+that.loading_num).html())!==50){
                    //
                    //        $("."+that.loading_num).html(current_loading_num);
                    //        current_loading_num = parseInt( $("."+that.loading_num).html())+1;
                    //
                    //
                    //
                    //
                    //    }else{
                    //        clearInterval(time_task);
                    //        //
                    //        //$(".loading").css("display","none")
                    //        //$(".left-arrow").css("display","block")
                    //        //$(".right-arrow").css("display","block")
                    //        //
                    //        //that.initEventMy();
                    //
                    //        var time_task2 = setInterval(function(){
                    //
                    //            if(parseInt( $("."+that.loading_num).html())!==80){
                    //
                    //                $("."+that.loading_num).html(current_loading_num);
                    //                current_loading_num = parseInt( $("."+that.loading_num).html())+1;
                    //
                    //
                    //
                    //
                    //            }else{
                    //                clearInterval(time_task2);
                    //                var time_task3 = setInterval(function(){
                    //
                    //                    if(parseInt( $("."+that.loading_num).html())!==90){
                    //
                    //                        $("."+that.loading_num).html(current_loading_num);
                    //                        current_loading_num = parseInt( $("."+that.loading_num).html())+1;
                    //
                    //
                    //
                    //
                    //                    }else{
                    //                        clearInterval(time_task3);
                    //
                    //                        var time_task4 = setInterval(function(){
                    //
                    //                            if(parseInt( $("."+that.loading_num).html())!==100){
                    //
                    //                                $("."+that.loading_num).html(current_loading_num);
                    //                                current_loading_num = parseInt( $("."+that.loading_num).html())+1;
                    //
                    //
                    //
                    //
                    //                            }else{
                    //                                clearInterval(time_task4);
                    //                                $(".loading").css("display","none")
                    //                                $(".left-arrow").css("display","block")
                    //                                $(".right-arrow").css("display","block")
                    //
                    //                                that.initEventMy();
                    //
                    //                            }
                    //
                    //
                    //
                    //                        },1000)
                    //                    }
                    //
                    //
                    //
                    //                },700)
                    //
                    //            }
                    //
                    //
                    //
                    //        },500)
                    //    }
                    //
                    //
                    //
                    //},200)

                    //开发环境
                    var time_task = setInterval(function(){


                       if(parseInt( $("."+that.loading_num).html())!==100){

                           $("."+that.loading_num).html(current_loading_num);
                           current_loading_num = parseInt( $("."+that.loading_num).html())+1;




                       }else{
                           clearInterval(time_task);

                           $(".loading").css("display","none")
                           $(".left-arrow").css("display","block")
                           $(".right-arrow").css("display","block")

                           that.initEventMy();

                       }



                    },5)




                },
               initEventMy:function(){
                   var that =this;


                   $(".game-container").bind("touchstart",function(e){

                       that.game_container_start_X = e.originalEvent.targetTouches[0].pageX-this.offsetLeft;
                       that.game_container_client_X = e.originalEvent.targetTouches[0].pageX;



                   });

                   $(".game-container").bind("touchmove",function(e){


                       var current_X = e.originalEvent.targetTouches[0].pageX;
                       that.moveClient_X = e.originalEvent.targetTouches[0].pageX;

                       //边界判断    左边界   到达边界还想移动     未到边界  移动距离后超出边界
                       if((this.offsetLeft==0&&that.moveClient_X - that.game_container_client_X>0)||current_X - that.game_container_start_X>0){
                           $(".game-container").css("left",0+"px")

                       }
                       //边界判断    右边界  到达边界还想移动     未到边界  移动距离后超出边界
                       else if((this.offsetLeft==-(that.container_width-window.innerWidth) &&  that.moveClient_X - that.game_container_client_X<0)||current_X - that.game_container_start_X<-375){
                           $(".game-container").css("left",-(that.container_width-window.innerWidth)+"px")

                       }

                       else{
                           $(".game-container").css("left",current_X - that.game_container_start_X)

                       }

                   });


                   $("#left-arrow").bind("touchstart",function(){


                       if($(".top-container").css("left")==-that.container_width+"px"&& parseInt($(".current_container").css("left"))==0){

                           $(".current_container").addClass("wait_container").removeClass("current_container").siblings().removeClass("wait_container").addClass("current_container");;

                           $(".top-container").css("left",0+"px")
                           $(".section1").css("left",0+"px")
                           $(".section1").fadeOut(0).fadeIn(1000);
                       }else{
                           $(".current_container").css("left",0+"px")
                       }


                   });

                   $("#right-arrow").bind("touchstart",function(){




                       if($(".top-container").css("left")==0+"px"&&parseInt($(".current_container").css("left"))==-(that.container_width-window.innerWidth)){

                           $(".current_container").addClass("wait_container").removeClass("current_container").siblings().removeClass("wait_container").addClass("current_container");
                           $(".section2").css("left",0+"px");
                           $(".top-container").css("left",-that.container_width+"px");
                           $(".section2").fadeOut(0).fadeIn(1000);
                       }else{
                           $(".current_container").css("left",-(that.container_width-window.innerWidth)+"px")
                       }

                   });

                   $(".zaihuang-medication").bind("touchstart",function(){
                        $(".section-documents-container").css("display","block");
                        $(".section-documents").css("display","block").siblings().css("display","none");
                        var img_str = "<div class='country-goods'><img src='images/top3.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });
                   $(".yunnan-medication").bind("touchstart",function(){

                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top7.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });

                   $(".simulation-train-move").bind("touchstart",function(){
                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top1.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });


                   $(".huawei-iphone").bind("touchstart",function(){
                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top2.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });


                   $(".important-paper").bind("touchstart",function(){
                       $(".section-documents-container").css("display","block");
                       $(".section-clue").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='clue'><img src='images/photo.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-clue").html(img_str);
                        that.hasLastPuzzle = true;

                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-clue").html("");

                       });

                   });


                   $(".simulation-bedside-table").bind("touchstart",function(){
                     if(that.hasKey==false){
                         $(".section-documents-container").css("display","block");
                         $(".section-clue").css("display","block").siblings().css("display","none");
                         var img_str = "<div class='clue'><img src='images/photo_clue02.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                         $(".section-clue").html(img_str);


                         $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                             $(".section-documents-container").css("display","none");
                             $(".section-clue").html("");

                         });
                     }

                   });

                   $(".begin_puzzle").bind("touchstart",function(){

                       $(".begin_puzzle").addClass("begin_puzzle_changeBig")




                       var time_task_6 =  setTimeout(function(){

                            $(".puzzle-container").css("display","block");
                        },1000);


                    if(that.hasLastPuzzle){

                    }else{

                    }



                   });


                 $("img").unbind("touchstart",function(){
                     return false;
                 })

               }


           }

            Game.prototype.constructor = Game;


            function Game(loading_num){
                this.loading_num = loading_num;
                this.windowClientWidth = document.body.clientWidth;
                this.windowClientHeight = document.body.clientHeight;
                this.background_WH = 1490/1206;
                this.container_width = parseInt(window.innerHeight*(this.background_WH));
                this.hasKey = false;
                this.hasLastPuzzle = false;



                this.loading_num = loading_num;
                this.initLoadIng();
            }

          function loading_bg(){

                var img1 = new Image();
                var img2 = new Image();
                var img3 = new Image();

                img1.src = "images/loading-bg.png"
                img2.src = "images/loading-time-img.png"
                img3.src = $(".loading-content img").attr("src")
                img3.onload = function(){
                    var game  = new  Game("loading-num-percentage");
                };

          }

             loading_bg();

            Puzzle.prototype = {
                initDomPuzzle:function(){
                   var that = this;


                }
            }
           Puzzle.prototype.constructor = Puzzle;
            function  Puzzle(game){
               this.game = game;
                this.initDomPuzzle();
            }

    //jQuery(document).ready(function ($) {
    //    if (window.history && window.history.pushState) {
    //        $(window).on('popstate', function () {
    //            window.history.forward(1);
    //        });
    //    }
    //});



})(jQuery)