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
                    $(".simulation-train-move").height($(".train").height()*1.5);




                    $(".icons").height($(".icons").width());
                    $(".icons").css("marginTop",-$(".icons").height()/2);

                    that.game_container_start_X = 0;
                    that.game_container_client_X = 0;
                    that.moveClient_X = 0;
                    var current_loading_num = 0;
                    $(".section-bg").width(that.container_width);
                    $(".top-container").width(2*that.container_width);



                    $(".input_password_showNum").css("lineHeight",window.innerWidth*0.48*0.28+"px")




                    //线上环境
                    var time_task = setInterval(function(){

                        if(parseInt( $("."+that.loading_num).html())!==50){

                            $("."+that.loading_num).html(current_loading_num);
                            current_loading_num = parseInt( $("."+that.loading_num).html())+1;




                        }else{
                            clearInterval(time_task);
                            //
                            //$(".loading").css("display","none")
                            //$(".left-arrow").css("display","block")
                            //$(".right-arrow").css("display","block")
                            //
                            //that.initEventMy();

                            var time_task2 = setInterval(function(){

                                if(parseInt( $("."+that.loading_num).html())!==80){

                                    $("."+that.loading_num).html(current_loading_num);
                                    current_loading_num = parseInt( $("."+that.loading_num).html())+1;




                                }else{
                                    clearInterval(time_task2);
                                    var time_task3 = setInterval(function(){

                                        if(parseInt( $("."+that.loading_num).html())!==90){

                                            $("."+that.loading_num).html(current_loading_num);
                                            current_loading_num = parseInt( $("."+that.loading_num).html())+1;




                                        }else{
                                            clearInterval(time_task3);

                                            var time_task4 = setInterval(function(){

                                                if(parseInt( $("."+that.loading_num).html())!==100){

                                                    $("."+that.loading_num).html(current_loading_num);
                                                    current_loading_num = parseInt( $("."+that.loading_num).html())+1;




                                                }else{
                                                    clearInterval(time_task4);
                                                    $(".loading").css("display","none")
                                                    $(".left-arrow").css("display","block")
                                                    $(".right-arrow").css("display","block")

                                                    that.initEventMy();
                                                }
                                            },800)
                                        }
                                    },500)

                                }

                            },300)
                        }

                    },200)

                    //开发环境
                    //var time_task = setInterval(function(){
                    //
                    //
                    //   if(parseInt( $("."+that.loading_num).html())!==100){
                    //
                    //       $("."+that.loading_num).html(current_loading_num);
                    //       current_loading_num = parseInt( $("."+that.loading_num).html())+1;
                    //
                    //
                    //
                    //
                    //   }else{
                    //       clearInterval(time_task);
                    //
                    //       $(".loading").css("display","none")
                    //       $(".left-arrow").css("display","block")
                    //       $(".right-arrow").css("display","block")
                    //
                    //       that.initEventMy();
                    //
                    //   }
                    //
                    //
                    //
                    //},5);




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

                   $(".zaihuang-medication").unbind("touchstart").bind("touchstart",function(){
                        $(".section-documents-container").css("display","block");
                        $(".section-documents").css("display","block").siblings().css("display","none");
                        var img_str = "<div class='country-goods'><img src='images/top3.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });
                   $(".yunnan-medication").unbind("touchstart").bind("touchstart",function(){

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


                   $(".huawei-iphone").unbind("touchstart").bind("touchstart",function(){
                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top2.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });


                   $(".important-paper").unbind("touchstart").bind("touchstart",function(){


                       if(that.hasCompletPuzzle&&!that.hasKey){

                           $(".section-documents-container").css("display","block");
                           $(".section-clue").css("display","block").siblings().css("display","none");
                           var img_str = "<div class='clue'><img src='images/key.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                           $(".section-clue").html(img_str);
                           that.hasLastPuzzle = true;
                           that.hasKey = true;


                           var current_num = parseInt($("#current_num_clue").html())+2;
                           $("#current_num_clue").html(current_num)






                           $(".icon_key").css("display","block");
                           $(".icon_controll").css("display","none");
                           $(".icon_puzzle").css("display","none");
                           $(".last-paper").css("display","none");

                           $(".icon_key").addClass("icon__move");

                           $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                               $(".section-documents-container").css("display","none");
                               $(".section-clue").html("");

                           });
                       }else{

                           if(!that.hasLastPuzzle){

                           $(".section-documents-container").css("display","block");
                           $(".section-clue").css("display","block").siblings().css("display","none");
                           var img_str = "<div class='clue'><img src='images/photo.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                           $(".section-clue").html(img_str);
                            that.hasLastPuzzle = true;


                            var current_num = parseInt($("#current_num_clue").html())+1;
                               $("#current_num_clue").html(current_num)

                               $(".last-paper").css("display","none");



                             $(".icon_key").css("display","none");
                             $(".icon_controll").css("display","none");
                             $(".icon_puzzle").css("display","block");






                               $(".icon_puzzle").addClass("icon__move");

                           $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                               $(".section-documents-container").css("display","none");
                               $(".section-clue").html("");

                           });
                           }
                       }

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
                     }else{



                         $(".section-documents-container").css("display","block");
                         $(".section-clue_calendar").css("display","block").siblings().css("display","none");
                         var img_str = "<div class='clue_calendar' id='clue_calendar'><img src='images/in_table_clue.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                         $(".section-clue_calendar").html(img_str);


                         $("#clue_calendar").bind("touchstart",function(){



                             $(".section-clue_calendar").css("display","none");
                             $(".section-documents").css("display","block").siblings().css("display","none");
                             var img_str = "<div class='country-goods'><img src='images/top8.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                             $(".section-documents").html(img_str);


                             $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                                 $(".section-documents-container").css("display","none");
                                 $(".section-documents").html("");

                             });

                         });
                         $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                             $(".section-documents-container").css("display","none");
                             $(".section-clue_calendar").html("");

                         });

                     }

                   });

                   $(".begin_puzzle").unbind("touchstart").bind("touchstart",function(){


                       $(".begin_puzzle").addClass("begin_puzzle_changeBig");
                       //$(".realpuzzle_bg-container").addClass("realpuzzle_bg_move");


                       //$(".realpuzzle_bg").addClass("isShow_wait_random");

                       var time_task_6 =  setTimeout(function(){

                           $(".realpuzzle_bg-container").css("display","block");
                           $(".puzzle-container").fadeIn(2000);




                           if(!$(this).hasClass("complete_puzzle") || !$(this).hasClass("wait_puzzle")){
                               if(!that.puzzle){
                                   that.puzzle = new Puzzle(that);
                               }
                           }else{



                           }

                           //$(".puzzle_small").width( parseInt(($(".realpuzzle_bg").width()-6)/3));
                           //$(".puzzle_small").height(parseInt(($(".realpuzzle_bg").height()-6)/3));








                           clearTimeout(time_task_6);

                        },2000);

                   });

                   $(".complete_puzzle").unbind("touchstart").bind("touchstart",function(){

                        if(that.hasLastPuzzle&&that.hasCompletPuzzle){
                            $(".section-documents-container").css("display","block");
                            $(".section-documents").css("display","block").siblings().css("display","none");
                            var img_str = "<div class='country-goods'><img src='images/top6.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                            $(".section-documents").html(img_str);


                            $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                                $(".section-documents-container").css("display","none");
                                $(".section-documents").html("");

                            });
                        }
                       else if(that.hasCompletPuzzle&&!that.hasLastPuzzle){
                            $(".section-documents-container").css("display","block");
                            $(".section-clue").css("display","block").siblings().css("display","none");
                            var img_str = "<div class='clue'><img src='images/photo_clue01.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                            $(".section-clue").html(img_str);


                            $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                                $(".section-documents-container").css("display","none");
                                $(".section-clue").html("");

                            });
                        }
                   });

                   $(".uva").unbind("touchstart").bind("touchstart",function(){

                     if(!that.controller_uva){
                         $(".section-documents-container").css("display","block");
                         $(".section-documents").css("display","block").siblings().css("display","none");
                         var img_str = "<div class='country-goods'><img src='images/top5.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                         $(".section-documents").html(img_str);


                         $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                             $(".section-documents-container").css("display","none");
                             $(".section-documents").html("");

                         });
                     }else{



                     }
                   });

                   $(".light").bind("touchstart",function(){

                       if($(".light_close").css("display")=="block"){
                           $(".light_close").css("display","none")
                           $(".light_open").css("display","block")
                       }else{
                           $(".light_close").css("display","block")
                           $(".light_open").css("display","none")
                       }
                   });

                   $(".show_toy").bind("touchstart",function(){
                           $(".toy").css("display","block");
                   });


                   $(".show_book").bind("touchstart",function(){

                       $(".section-documents-container").css("display","block");
                       $(".section-clue_book").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='clue_book'><img src='images/password.png' alt=''/></div><div class='close-mask'><img src='images/close-mask02.png' alt=''/></div>"

                       $(".section-clue_book").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-clue_book").html("");

                       });

                   });


                   $(".byd_car").bind("touchstart",function(){

                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top10.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });

                   $(".haier").bind("touchstart",function(){

                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top9.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });

                   $(".open_safe").unbind("touchstart").bind("touchstart",function(){
                       $(".open_safe_open").css("display","block");


                   });

                   $(".open_safe_open").unbind("touchstart").bind("touchstart",function(){
                   //  密码输入


                   });




                   $(".open_table").unbind("touchstart").bind("touchstart",function(){

                       $(".open_table_open").css("display","block");


                   });
                   $(".open_table_open").unbind("touchstart").bind("touchstart",function(){

                       $(".no_use").css("display","block");

                   });

                   $(".no_use").unbind("touchstart").bind("touchstart",function(){

                       $(".section-documents-container").css("display","block");
                       $(".section-clue").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='clue'><img src='images/nouse.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-clue").html(img_str);



                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-clue").html("");

                       });
                   });


                   $("#sauce").bind("touchstart",function(){
                       $("#sauce").addClass("sauce_move");
                       $(".laoganma").addClass("laoganma_move");
                   });
                   $("#sauce").bind("animationend",function(){
                       $("#sauce").removeClass("sauce_move");

                   });

                   $(".laoganma").bind("touchstart",function(){
                       $(".section-documents-container").css("display","block");
                       $(".section-documents").css("display","block").siblings().css("display","none");
                       var img_str = "<div class='country-goods'><img src='images/top4.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                       $(".section-documents").html(img_str);


                       $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".section-documents").html("");

                       });

                   });

                   $(".milk").bind("touchstart",function(){
                       $(".milk").addClass("moveMilk");

                   });
                   $(".milk").bind("animationend",function(){
                       $(".milk").removeClass("moveMilk");

                   });



                   $(".paper_03").bind("touchstart",function(){
                       $(".paper_03").addClass("sauce_move");
                       $(".paper_02").addClass("sauce_move");
                       $(".paper_01").addClass("paper_01_move");
                   });
                   $(".paper_03").bind("animationend",function(){
                       $(".paper_03").removeClass("sauce_move");
                       $(".paper_02").removeClass("sauce_move");

                   });


                   $(".open_safe_open").bind("touchstart",function(){
                       $(".section-documents-container").css("display","block");
                       $(".password_input").css("display","block");



                       $(".close-mask_03").unbind("touchstart").bind("touchstart",function(){
                           $(".section-documents-container").css("display","none");
                           $(".password_input").css("display","none");

                       });

                   });

                   $(".input_password li").bind("touchstart",function(){

                       if($(this).attr("data-index")&&$(".input_password_showNum .num_password").length<4){

                           $(".input_password_showNum").append("<span class='num_password'>"+$(this).attr("data-index")+"</span>");
                       }else if($(this).attr("data-index")&&$(".input_password_showNum .num_password").length==4){
                           $($(".input_password_showNum .num_password")[3]).html($(this).attr("data-index"));
                       }

                   });

                   $(".remove_password").bind("touchstart",function(){

                       if($(".num_password").length>=1){
                           $($(".num_password")[$(".num_password").length-1]).remove();
                       }

                   });
                   $(".end_password").bind("touchstart",function(){

                       if($(".num_password").length>=1){


                       var str = "";
                       for(var i=0;i<$(".num_password").length;i++){

                                str += $($(".num_password")[i]).html();

                          }



                           if(str == "1462"){

                               $(".password_input").css("display","none");
                               $(".section-clue").css("display","block").siblings().css("display","none");
                               var img_str = "<div class='clue'><img src='images/control.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                               $(".section-clue").html(img_str);

                               that.controller_uva = true;

                               var current_num = parseInt($("#current_num_clue").html())+1;
                               $("#current_num_clue").html(current_num)





                               $(".icon_key").css("display","none");
                               $(".icon_controll").css("display","block");
                               $(".icon_puzzle").css("display","none");


                               $(".icon_controll").addClass("icon__move");


                               $(".uva_controll").css("display","block");
                               $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                                   $(".section-documents-container").css("display","none");
                                   $(".section-clue").html("");

                               });

                           }
                           else{

                               $(".input-container").removeClass("moveshark");

                                   $(".input-container").addClass("moveshark");
                           }
                       }
                   });

                   $(".input-container").bind("animationend",function(){
                       $(".input-container").removeClass("moveshark");

                   });


                   that.coule_click = true;

                   $(".uva_controll").bind("touchstart",function(){

                        if(that.controller_uva&&that.coule_click){

                            that.coule_click = false;

                             var current_add = 12;
                            var time_task_8 = setInterval(function(){

                                that.coule_click = false;

                                var top_current =parseInt( $(".uva").css("bottom"));



                                if((top_current+current_add)>=(window.innerHeight-$(".uva").height())){

                                    $(".uva").css("bottom",(window.innerHeight-$(".uva").height())+"px");

                                   $(".left-arrow").css("display","none");
                                   $(".right-arrow").css("display","none");



                                    $(".section-documents-container").css("display","block");
                                    $(".section-clue").css("display","block").siblings().css("display","none");

                                    var img_str = "<div class='clue'><img src='images/end_game.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                                    $(".section-clue").html(img_str);



                                    $(".section-clue").unbind("touchstart").bind("touchstart",function(){

                                        $(".section-documents-container").css("display","none");
                                        $(".state_clue").css("display","none");

                                        $(".top-container").fadeOut(1000);

                                    });




                                    clearInterval(time_task_8);



                                }else{
                                    $(".uva").css("bottom",(top_current+current_add)+"px");
                                    current_add+= 2;
                                }

                            },50)



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
                this.controller_uva = false;



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
                img3.src = $(".train img").attr("src")
                img3.onload = function(){
                    window.game  = new  Game("loading-num-percentage");
                };

          }

             loading_bg();



            Puzzle.prototype = {
                initDomPuzzle:function(){
                   var that = this;

                     that.onece = true;
                    if(that.game.hasLastPuzzle){
                        $(".hasLastPuzzle").css("display","block");
                        $(".noLastPuzzle").css("display","none");
                    }
                    that.puzzle_width = $(".puzzle_small").width();
                    that.puzzle_height= $(".puzzle_small").height();
                    that.each_area = that.puzzle_height*that.puzzle_width;

                    that.after_random_init = [];


                    var task_time_7  = setTimeout(function(){


                        that.randomPuzzle_small();

                        clearTimeout(task_time_7)
                    },2000);




                },
                randomPuzzle_small:function(){
                    var that = this;

                    for(var i=0;i<20;i++){

                        var b_index = parseInt(Math.random()*9);
                        var i_index = parseInt(Math.random()*9);

                        if(i_index!=b_index){
                            that.initChangeOrder(i_index,b_index);
                        }
                    }


                    that.alreadyRandom = true;

                //    记录运动完后的初始对应  位置
                    that.initFirstRandomAfter();
                    that.puzzleEvent();

                },
                initFirstRandomAfter:function(){


                    var that = this;



                    for(var i=0;i<$(".puzzle_small").length;i++){
                       var obj = {}
                        //遇见神坑 调试了无数遍   注意 jquery  获取的是外链的css    js 获取的是内联  开始替换时 jquery 无效弃用后 用了原生js

                        obj.left =$(".puzzle_small")[i].style.left;
                        obj.top =$(".puzzle_small")[i].style.top;
                        obj["data-index"] =$($(".puzzle_small")[i]).attr("data-index");
                        obj.n =$($(".puzzle_small")[i]).index() ;

                        that.after_random_init.push( that.deepCopy(obj,{}));


                    }







                },
                initChangeOrder:function(a,b,has_after_random_init){
                    if(!has_after_random_init){


                        var temp_index,temp_left,temp_top
                        //var puzzle_smalls=document.getElementsByClassName("puzzle_small");


                        var aEle = document.getElementsByClassName("puzzle_small")[a];
                        var bEle = document.getElementsByClassName("puzzle_small")[b];

                        temp_left = aEle.style.left;
                        aEle.style.left = bEle.style.left;
                        bEle.style.left = temp_left;

                        temp_top = aEle.style.top;
                        aEle.style.top = bEle.style.top;
                        bEle.style.top = temp_top;

                        temp_index = aEle.getAttribute("data-index");
                        aEle.setAttribute("data-index",bEle.getAttribute("data-index") );
                        bEle.setAttribute("data-index",temp_index);
                    }
                    else{

                    }


                //    jquery  更换时出现  重叠


                },
                changeArrayRealDistance:function(n_index_a,n_index_b){
                //    多走一步 每次 点击松开后，换虚拟位置的同时   更换数组中实际位移动画前位置  防止动画位移乱跑；
                //    ..... 加上动画


                        var that = this;
                    that.after_random_init[n_index_a];
                    that.after_random_init[n_index_b];



                        var temp = that.deepCopy(that.after_random_init[n_index_a],{});
                       //深clone a

                       var  n_a = that.after_random_init[n_index_a];

                       var  n_b = that.after_random_init[n_index_b];

                    that.after_random_init[n_index_a]["data-index"] = that.after_random_init[n_index_b]["data-index"];
                    that.after_random_init[n_index_a]["left"] = that.after_random_init[n_index_b]["left"];
                    that.after_random_init[n_index_a]["top"] = that.after_random_init[n_index_b]["top"];


                    that.after_random_init[n_index_b]["data-index"] = temp["data-index"];
                    that.after_random_init[n_index_b]["left"] = temp["left"];
                    that.after_random_init[n_index_b]["top"] = temp["top"];

                    that.after_random_init[n_index_a]
                    that.after_random_init[n_index_b]

                    $($(".puzzle_small")[n_index_a]).css("left",that.after_random_init[n_index_a]["left"])
                    $($(".puzzle_small")[n_index_a]).css("top",that.after_random_init[n_index_a]["top"])
                    $($(".puzzle_small")[n_index_a]).attr("data-index",that.after_random_init[n_index_a]["data-index"])


                    $($(".puzzle_small")[n_index_b]).css("left",that.after_random_init[n_index_b]["left"])
                    $($(".puzzle_small")[n_index_b]).css("top",that.after_random_init[n_index_b]["top"])
                    $($(".puzzle_small")[n_index_b]).attr("data-index",that.after_random_init[n_index_b]["data-index"])

                },
                deepCopy:function(p, c){
                    var that = this;
                    var c = c || [];
                    for (var i in p) {
                        if (typeof p[i] === 'object') {
                            c[i] = (p[i].constructor === Array) ? [] : {};
                            that.deepCopy(p[i], c[i]);
                        } else {
                            c[i] = p[i];
                        }
                    }
                    return c;
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

                         that.current_move_before_top = $(this).css("top");
                         that.current_move_before_left =$(this).css("left");

                         that.start_offsetLeft = this.offsetLeft;
                         that.start_offsetTop = this.offsetTop;



                       var n =  $(this).index();




                    });
                    $(".puzzle_small").bind("touchmove",function(e){

                    //    限定边界 不让移动


                    that.current_x = e.originalEvent.targetTouches[0].pageX;
                    that.current_y = e.originalEvent.targetTouches[0].pageY;



                        $(this).css("left",that.current_x-that.start_inner_x+"px");
                        $(this).css("top",that.current_y-that.start_inner_y+"px");

                    // //只管位移    减去到小方块总的点的距离
                    });

                    $(".puzzle_small").bind("touchend ",function(e){

                        that.end_x = e.originalEvent.changedTouches [0].pageX;
                        that.end_y = e.originalEvent.changedTouches [0].pageY;

                        $(this).css("z-index",100);
                        $(this).css("transition","all 0.5s ease 0s");



                      //  1 传入当前 时刻  的 被点击  被放开 拼图 的位置。！

                      var obj =  that.isChangeOrNo(this,this.offsetLeft,this.offsetTop);


                        if($(this).index()== $(obj).index()){

                            $(this).css("left",that.after_random_init[$(this).index()].left);
                            $(this).css("top",that.after_random_init[$(this).index()].top);
                            $(this).attr("data-index",that.after_random_init[$(this).index()]["data-index"]);

                        }else{

                                //that.changeOrder($(this).index(),$(obj).index());
                                that.changeArrayRealDistance($(this).index(),$(obj).index());

                        }


                    });


                    $(".puzzle_small").bind("transitionend ",function(e){
                        var e = e||event;

                        var str = "";
                        for(var i=0;i<$(".puzzle_small").length;i++){

                            str += $($(".puzzle_small")[i]).attr("data-index");


                        }

                        if(str == "123456789"&&that.game.hasLastPuzzle&&that.alreadyRandom){

                            that.game.hasKey = true;
                            $(".realpuzzle_bg-container").css("display","none");
                            $(".puzzle-container").css("display","none");

                            $(".begin_puzzle").css("display","none");
                            $(".complete_puzzle").css("display","block");
                            $(".complete_puzzle").addClass("complete_puzzle_changeSmall");
                            that.game.hasCompletPuzzle = true;


                            if(that.onece){
                                var current_num = parseInt($("#current_num_clue").html())+1;
                                $("#current_num_clue").html(current_num)





                                $(".icon_key").css("display","block");
                                $(".icon_controll").css("display","none");
                                $(".icon_puzzle").css("display","none");


                                $(".icon_key").addClass("icon__move");

                                that.onece  = false;
                            }



                            $(".section-documents-container").css("display","block");
                            $(".section-clue").css("display","block").siblings().css("display","none");
                            var img_str = "<div class='clue'><img src='images/key.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                            $(".section-clue").html(img_str);



                            $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                                $(".section-documents-container").css("display","none");
                                $(".section-clue").html("");

                            });

                        }

                        if(str == "123456789"&&that.alreadyRandom&&!that.game.hasLastPuzzle){

                            $(".realpuzzle_bg-container").css("display","none");
                            $(".puzzle-container").css("display","none");

                            //document.getElementById("puzzle_wall").className = "puzzle complete_puzzle_changeSmall complete_puzzle";

                            $(".begin_puzzle").css("display","none");
                            $(".complete_puzzle").css("display","block");
                            $(".complete_puzzle").addClass("complete_puzzle_changeSmall");
                            that.game.hasCompletPuzzle = true;
                            //$(".begin_puzzle").removeClass("begin_puzzle_changeBig");
                            //
                            //if(!$(".begin_puzzle").hasClass("complete_puzzle_changeSmall")){
                            //    $(".begin_puzzle") .addClass("complete_puzzle_changeSmall");
                            //}
                            //if(!$(".begin_puzzle").hasClass("complete_puzzle")){
                            //    $(".begin_puzzle") .addClass("complete_puzzle");
                            //}
                            //$(".begin_puzzle") .removeClass(".begin_puzzle");

                            $(".section-documents-container").css("display","block");
                            $(".section-clue").css("display","block").siblings().css("display","none");
                            var img_str = "<div class='clue'><img src='images/photo_clue01.png' alt=''/></div><div class='close-mask'><img src='images/close-mask.png' alt=''/></div>"

                            $(".section-clue").html(img_str);


                            $(".close-mask").unbind("touchstart").bind("touchstart",function(){
                                $(".section-documents-container").css("display","none");
                                $(".section-clue").html("");

                            });
                        }

                    });

                },
                isChangeOrNo:function(obj,move_x,move_y){
                     var that = this;
                    //判断和谁换




                  //  重合面积大于一半。

                    for(var i=0;i<$(".puzzle_small").length;i++){


                        if($(".puzzle_small")[i]==obj){
                            continue
                        }

                        var doublication_width = that.puzzle_width - ( Math.abs($(".puzzle_small")[i].offsetLeft-move_x));
                        var doublication_height = that.puzzle_height - ( Math.abs($(".puzzle_small")[i].offsetTop-move_y));
                        var doublication_area = doublication_width*doublication_height;


                        if(doublication_width>0&&doublication_height>0&&doublication_area>(that.each_area/2)){


                            return  $(".puzzle_small")[i];

                        }



                    }


                    return obj;

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