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


                   $("#left-arrow").unbind("touchstart").bind("touchstart",function(){


                       if($(".section2").css("display")=="block"&& parseInt($(".current_container").css("left"))==0){

                           //$(".section2").fadeOut(2000);
                           //
                           //$(".section1").fadeOut(1000).fadeIn(1000);


                           $(".current_container").removeClass("current_container").addClass("wait_container").siblings().removeClass("wait_container").addClass("current_container");;


                           $(".section1").css("left",-(that.container_width-window.innerWidth)+"px");



                       }else{
                           $(".current_container").css("left",0+"px")
                       }


                   });

                   $("#right-arrow").unbind("touchstart").bind("touchstart",function(){





                       if(parseInt($(".current_container").css("left"))==-(that.container_width-window.innerWidth)&&$(".section1").css("display")=="block"){

                           //$(".section1").fadeOut(2000);
                           //
                           //$(".section2").fadeOut(1000).fadeIn(1000);


                           $(".current_container").removeClass("current_container").addClass("wait_container").siblings().removeClass("wait_container").addClass("current_container");
                           $(".section2").css("left",0+"px");



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

                       $(".begin_puzzle").addClass("begin_puzzle_changeBig");
                       //$(".realpuzzle_bg-container").addClass("realpuzzle_bg_move");


                       $(".realpuzzle_bg").addClass("isShow_wait_random");

                       var time_task_6 =  setTimeout(function(){

                           $(".realpuzzle_bg-container").css("display","block");
                           $(".puzzle-container").fadeIn(2000);






                           //$(".puzzle_small").width( parseInt(($(".realpuzzle_bg").width()-6)/3));
                           //$(".puzzle_small").height(parseInt(($(".realpuzzle_bg").height()-6)/3));


                           if(!that.puzzle){
                               that.puzzle = new Puzzle(that);
                           }





                           clearTimeout(time_task_6);

                        },2000);








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


                    if(that.game.hasLastPuzzle){
                        $(".hasLastPuzzle").css("display","block");
                        $(".noLastPuzzle").css("display","none");
                    }

                    var task_7  = setTimeout(function(){
                        that.randomPuzzle_small();
                    },2000);




                },randomPuzzle_small:function(){
                    var that = this;

                    for(var i=0;i<20;i++){

                        var b_index = parseInt(Math.random()*9);
                        var i_index = parseInt(Math.random()*9);

                        if(i_index!=b_index){
                            that.changeOrder(i_index,b_index);
                        }
                    }





                },
                changeOrder:function(a,b){
                    var temp_index,temp_left,temp_top
                    var puzzle_smalls=document.querySelectorAll('.puzzle_small');


                    var aEle = puzzle_smalls[a];
                    var bEle = puzzle_smalls[b];

                    temp_left = aEle.style.left;
                    aEle.style.left = bEle.style.left;
                    bEle.style.left = temp_left;

                    temp_top = aEle.style.top;
                    aEle.style.top = bEle.style.top;
                    bEle.style.top = temp_top;

                    temp_index = aEle.getAttribute("data-index");
                    aEle.setAttribute("data-index",bEle.getAttribute("data-index") );
                    bEle.setAttribute("data-index",temp_index);

                //    jquery  更换时出现  重叠


                },

                puzzleEvent:function(){

                    var that = this;
                    var puzzle_smalls=document.querySelectorAll('.puzzle_small');


                    $(".puzzle_small").bind("touchstart",function(e){

                        $(this).css("transition","none");
                         //距离左边边界距离(x值)   多出来15px  因为外层距离  但是offset 0  因为左边无缝隙
                         //that.start_x = e.originalEvent.targetTouches[0].pageX-parseInt($(".realpuzzle_bg-container").css("left"));

                         $(this).css("z-index",999);
                         that.start_x = e.originalEvent.targetTouches[0].pageX;
                         that.start_y = e.originalEvent.targetTouches[0].pageY;


                         //小拼图  内 x  的距离
                         that.start_inner_x = e.originalEvent.targetTouches[0].pageX-this.offsetLeft;
                         that.start_inner_y = e.originalEvent.targetTouches[0].pageY-this.offsetTop;
                         that.start_offsetLeft = this.offsetLeft;
                         that.start_offsetTop = this.offsetTop;



                        console.log(that.start_offsetTop)



                    });
                    $(".puzzle_small").bind("touchmove",function(e){

                    //    限定边界 不让移动


                    that.current_x = e.originalEvent.targetTouches[0].pageX;
                    that.current_y = e.originalEvent.targetTouches[0].pageY;



                        //
                        ////左边界
                        //if(this.offsetLeft - (that.start_inner_x-that.current_x)<0){
                        //
                        //    $(this).css("left",0);
                        //
                        //    $(this).css("top",that.current_y-that.start_inner_y+"px");
                        //}
                        ////右边界
                        //else if( that.current_x-that.start_inner_x >$(this).width()*2){
                        //
                        //    $(this).css("left",$(this).width()*2);
                        //
                        //    $(this).css("top",that.current_y-that.start_inner_y+"px");
                        //}
                        ////上边界
                        //else  if(this.offsetTop - (that.start_inner_y-that.current_y)<0){
                        //
                        //    $(this).css("left",that.current_x-that.start_inner_x+"px");
                        //
                        //    $(this).css("top",0);
                        //}
                        ////下边界
                        //else if( that.current_y-that.start_inner_y >$(this).height()*2){
                        //
                        //    $(this).css("left",that.current_x-that.start_inner_x);
                        //
                        //    $(this).css("top",$(this).height()*2+"px");
                        //}
                        ////原点
                        //else if(this.offsetLeft - (that.start_inner_x-that.current_x)==0&&this.offsetTop - (that.start_inner_y-that.current_y)==0){
                        //    $(this).css("top",0);
                        //    $(this).css("left",0);
                        //
                        //}
                        //else if(this.offsetLeft - (that.start_inner_x-that.current_x)==0&&that.current_y-that.start_inner_y ==$(this).height()*2){
                        //    $(this).css("top",$(this).height()*2+"px");
                        //    $(this).css("left",0);
                        //}
                        //else if( that.current_x-that.start_inner_x ==$(this).width()*2&&this.offsetTop - (that.start_inner_y-that.current_y)==0){
                        //
                        //    $(this).css("left",$(this).width()*2+"px");
                        //
                        //    $(this).css("top",0);
                        //}
                        //else if( that.current_x-that.start_inner_x ==$(this).width()*2&&that.current_y-that.start_inner_y ==$(this).height()*2){
                        //
                        //    $(this).css("left",$(this).width()*2+"px");
                        //
                        //    $(this).css("top",$(this).height()*2+"px");
                        //}
                        //
                        ////正常
                        //else {
                        //
                        //    $(this).css("left",that.current_x-that.start_inner_x+"px");
                        //    $(this).css("top",that.current_y-that.start_inner_y+"px");
                        //}

                        $(this).css("left",that.current_x-that.start_inner_x+"px");
                        $(this).css("top",that.current_y-that.start_inner_y+"px");


                    });

                    $(".puzzle_small").bind("touchend ",function(e){

                    });


                    $(".puzzle_small").bind("transitionend ",function(e){
                        var e = e||event;
                    });

                }
            }
           Puzzle.prototype.constructor = Puzzle;
            function  Puzzle(game){
               this.game = game;
                this.initDomPuzzle();
                this.puzzleEvent();

            }

    //jQuery(document).ready(function ($) {
    //    if (window.history && window.history.pushState) {
    //        $(window).on('popstate', function () {
    //            window.history.forward(1);
    //        });
    //    }
    //});



})(jQuery)